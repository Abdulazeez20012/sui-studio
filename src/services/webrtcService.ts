import Peer, { MediaConnection } from 'peerjs';

export interface Participant {
  id: string;
  name: string;
  email?: string;
  stream?: MediaStream;
  connection?: MediaConnection;
  isMuted?: boolean;
  isVideoOff?: boolean;
}

class WebRTCService {
  private peer: Peer | null = null;
  private localStream: MediaStream | null = null;
  private participants: Map<string, Participant> = new Map();
  private onParticipantJoined?: (participant: Participant) => void;
  private onParticipantLeft?: (participantId: string) => void;
  private onStreamReceived?: (participantId: string, stream: MediaStream) => void;

  /**
   * Initialize PeerJS connection
   */
  async initialize(userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Create peer with custom config
        this.peer = new Peer(userId, {
          host: 'peerjs-server.herokuapp.com',
          port: 443,
          path: '/',
          secure: true,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' },
            ],
          },
        });

        this.peer.on('open', (id) => {
          console.log('PeerJS connected with ID:', id);
          resolve(id);
        });

        this.peer.on('error', (error) => {
          console.error('PeerJS error:', error);
          reject(error);
        });

        // Handle incoming calls
        this.peer.on('call', (call) => {
          console.log('Incoming call from:', call.peer);
          
          // Answer with local stream
          if (this.localStream) {
            call.answer(this.localStream);
          } else {
            call.answer();
          }

          // Receive remote stream
          call.on('stream', (remoteStream) => {
            console.log('Received stream from:', call.peer);
            this.handleRemoteStream(call.peer, remoteStream, call);
          });

          call.on('close', () => {
            console.log('Call closed with:', call.peer);
            this.removeParticipant(call.peer);
          });
        });

        this.peer.on('connection', (conn) => {
          console.log('Data connection from:', conn.peer);
          
          conn.on('data', (data: any) => {
            this.handleDataMessage(conn.peer, data);
          });
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Start local media (camera/microphone)
   */
  async startLocalMedia(options: { video?: boolean; audio?: boolean } = {}): Promise<MediaStream> {
    try {
      const constraints = {
        video: options.video !== false ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        } : false,
        audio: options.audio !== false ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } : false,
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Local media started:', this.localStream.id);
      return this.localStream;
    } catch (error) {
      console.error('Failed to start local media:', error);
      throw error;
    }
  }

  /**
   * Stop local media
   */
  stopLocalMedia() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
      console.log('Local media stopped');
    }
  }

  /**
   * Call a peer
   */
  async callPeer(peerId: string, participantInfo: Omit<Participant, 'id' | 'stream' | 'connection'>): Promise<void> {
    if (!this.peer || !this.localStream) {
      throw new Error('Peer or local stream not initialized');
    }

    try {
      console.log('Calling peer:', peerId);
      const call = this.peer.call(peerId, this.localStream);

      call.on('stream', (remoteStream) => {
        console.log('Received stream from:', peerId);
        this.handleRemoteStream(peerId, remoteStream, call);
      });

      call.on('close', () => {
        console.log('Call closed with:', peerId);
        this.removeParticipant(peerId);
      });

      call.on('error', (error) => {
        console.error('Call error with', peerId, error);
        this.removeParticipant(peerId);
      });

      // Store participant info
      this.participants.set(peerId, {
        id: peerId,
        ...participantInfo,
        connection: call,
      });

    } catch (error) {
      console.error('Failed to call peer:', error);
      throw error;
    }
  }

  /**
   * Handle remote stream
   */
  private handleRemoteStream(peerId: string, stream: MediaStream, connection: MediaConnection) {
    const participant = this.participants.get(peerId) || {
      id: peerId,
      name: peerId,
    };

    participant.stream = stream;
    participant.connection = connection;

    this.participants.set(peerId, participant);

    if (this.onStreamReceived) {
      this.onStreamReceived(peerId, stream);
    }

    if (this.onParticipantJoined) {
      this.onParticipantJoined(participant);
    }
  }

  /**
   * Handle data messages
   */
  private handleDataMessage(peerId: string, data: any) {
    console.log('Data from', peerId, data);
    
    if (data.type === 'mute') {
      const participant = this.participants.get(peerId);
      if (participant) {
        participant.isMuted = data.muted;
        this.participants.set(peerId, participant);
      }
    } else if (data.type === 'video') {
      const participant = this.participants.get(peerId);
      if (participant) {
        participant.isVideoOff = data.videoOff;
        this.participants.set(peerId, participant);
      }
    }
  }

  /**
   * Remove participant
   */
  private removeParticipant(peerId: string) {
    const participant = this.participants.get(peerId);
    if (participant) {
      if (participant.stream) {
        participant.stream.getTracks().forEach(track => track.stop());
      }
      if (participant.connection) {
        participant.connection.close();
      }
      this.participants.delete(peerId);

      if (this.onParticipantLeft) {
        this.onParticipantLeft(peerId);
      }
    }
  }

  /**
   * Toggle microphone
   */
  toggleMicrophone(): boolean {
    if (!this.localStream) return false;

    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      return audioTrack.enabled;
    }
    return false;
  }

  /**
   * Toggle camera
   */
  toggleCamera(): boolean {
    if (!this.localStream) return false;

    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      return videoTrack.enabled;
    }
    return false;
  }

  /**
   * Share screen
   */
  async shareScreen(): Promise<MediaStream> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      } as any);

      // Replace video track in all connections
      const videoTrack = screenStream.getVideoTracks()[0];
      
      this.participants.forEach((participant) => {
        if (participant.connection) {
          const sender = participant.connection.peerConnection
            ?.getSenders()
            .find(s => s.track?.kind === 'video');
          
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        }
      });

      // Handle screen share stop
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      return screenStream;
    } catch (error) {
      console.error('Failed to share screen:', error);
      throw error;
    }
  }

  /**
   * Stop screen sharing
   */
  async stopScreenShare() {
    if (!this.localStream) return;

    const videoTrack = this.localStream.getVideoTracks()[0];
    
    // Restore camera in all connections
    this.participants.forEach((participant) => {
      if (participant.connection) {
        const sender = participant.connection.peerConnection
          ?.getSenders()
          .find(s => s.track?.kind === 'video');
        
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      }
    });
  }

  /**
   * Get local stream
   */
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  /**
   * Get all participants
   */
  getParticipants(): Participant[] {
    return Array.from(this.participants.values());
  }

  /**
   * Get participant by ID
   */
  getParticipant(id: string): Participant | undefined {
    return this.participants.get(id);
  }

  /**
   * Set event handlers
   */
  setEventHandlers(handlers: {
    onParticipantJoined?: (participant: Participant) => void;
    onParticipantLeft?: (participantId: string) => void;
    onStreamReceived?: (participantId: string, stream: MediaStream) => void;
  }) {
    this.onParticipantJoined = handlers.onParticipantJoined;
    this.onParticipantLeft = handlers.onParticipantLeft;
    this.onStreamReceived = handlers.onStreamReceived;
  }

  /**
   * Disconnect and cleanup
   */
  disconnect() {
    // Stop local media
    this.stopLocalMedia();

    // Close all connections
    this.participants.forEach((participant) => {
      if (participant.stream) {
        participant.stream.getTracks().forEach(track => track.stop());
      }
      if (participant.connection) {
        participant.connection.close();
      }
    });

    this.participants.clear();

    // Destroy peer
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    console.log('WebRTC disconnected');
  }

  /**
   * Get peer ID
   */
  getPeerId(): string | null {
    return this.peer?.id || null;
  }
}

export const webrtcService = new WebRTCService();
