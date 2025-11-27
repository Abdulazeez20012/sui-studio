import React, { useEffect, useRef, useState } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, 
  MonitorOff, Users, Maximize2, Minimize2, Volume2, VolumeX 
} from 'lucide-react';
import { webrtcService, Participant } from '../../services/webrtcService';
import { useAuthStore } from '../../store/authStore';
import { collaborationService } from '../../services/collaborationService';

interface VideoChatProps {
  roomId: string;
  onClose?: () => void;
}

const VideoChat: React.FC<VideoChatProps> = ({ roomId, onClose }) => {
  const { user } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map());

  useEffect(() => {
    initializeWebRTC();

    return () => {
      webrtcService.disconnect();
    };
  }, []);

  const setupWebRTCSignaling = () => {
    // Handle WebRTC peer joined
    collaborationService.on('webrtc-peer-joined', (message: any) => {
      console.log('New peer joined:', message);
      // Call the new peer
      if (message.peerId && message.peerId !== webrtcService.getPeerId()) {
        webrtcService.callPeer(message.peerId, {
          name: message.userName || 'Unknown',
        }).catch(err => console.error('Failed to call peer:', err));
      }
    });

    // Handle existing peers
    collaborationService.on('webrtc-existing-peers', (message: any) => {
      console.log('Existing peers:', message.peers);
      // Call all existing peers
      message.peers.forEach((peer: any) => {
        if (peer.peerId && peer.peerId !== webrtcService.getPeerId()) {
          webrtcService.callPeer(peer.peerId, {
            name: peer.userName || 'Unknown',
          }).catch(err => console.error('Failed to call peer:', err));
        }
      });
    });

    // Handle WebRTC signals
    collaborationService.on('webrtc-signal', (message: any) => {
      console.log('Received WebRTC signal from:', message.fromPeerId);
      // Handle the signal (this would be used for more advanced signaling)
    });
  };

  const initializeWebRTC = async () => {
    try {
      // Initialize peer connection
      const peerId = await webrtcService.initialize(user?.id || `user-${Date.now()}`);
      console.log('Connected with peer ID:', peerId);

      // Start local media
      const stream = await webrtcService.startLocalMedia({
        video: true,
        audio: true,
      });

      // Display local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Set up event handlers
      webrtcService.setEventHandlers({
        onParticipantJoined: (participant) => {
          console.log('Participant joined:', participant);
          setParticipants(prev => [...prev.filter(p => p.id !== participant.id), participant]);
        },
        onParticipantLeft: (participantId) => {
          console.log('Participant left:', participantId);
          setParticipants(prev => prev.filter(p => p.id !== participantId));
          remoteVideosRef.current.delete(participantId);
        },
        onStreamReceived: (participantId, stream) => {
          console.log('Stream received from:', participantId);
          const videoElement = remoteVideosRef.current.get(participantId);
          if (videoElement) {
            videoElement.srcObject = stream;
          }
        },
      });

      setIsConnected(true);
      setError(null);

      // Setup WebRTC signaling through WebSocket
      setupWebRTCSignaling();

      // Announce presence in room
      collaborationService.joinWebRTCRoom(peerId);
    } catch (err: any) {
      console.error('Failed to initialize WebRTC:', err);
      setError(err.message || 'Failed to access camera/microphone');
    }
  };

  const toggleVideo = () => {
    const enabled = webrtcService.toggleCamera();
    setIsVideoOn(enabled);
  };

  const toggleAudio = () => {
    const enabled = webrtcService.toggleMicrophone();
    setIsAudioOn(enabled);
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await webrtcService.stopScreenShare();
        setIsScreenSharing(false);
      } else {
        await webrtcService.shareScreen();
        setIsScreenSharing(true);
      }
    } catch (err) {
      console.error('Screen share error:', err);
    }
  };

  const handleDisconnect = () => {
    webrtcService.disconnect();
    if (onClose) onClose();
  };

  const setRemoteVideoRef = (participantId: string) => (element: HTMLVideoElement | null) => {
    if (element) {
      remoteVideosRef.current.set(participantId, element);
      const participant = participants.find(p => p.id === participantId);
      if (participant?.stream) {
        element.srcObject = participant.stream;
      }
    }
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-dark-surface p-4">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <VideoOff size={48} className="mx-auto mb-2" />
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={initializeWebRTC}
            className="px-4 py-2 bg-sui-cyan text-black rounded-lg hover:bg-[#2ba6eb] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col bg-dark-surface ${isExpanded ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-dark-border">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-sui-cyan" />
          <span className="text-sm font-semibold text-white">
            Video Call ({participants.length + 1})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className={`grid gap-4 h-full ${
          participants.length === 0 ? 'grid-cols-1' :
          participants.length === 1 ? 'grid-cols-2' :
          participants.length <= 3 ? 'grid-cols-2' :
          'grid-cols-3'
        }`}>
          {/* Local Video */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
              You {!isVideoOn && '(Video Off)'}
            </div>
            {!isVideoOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-dark-bg">
                <VideoOff size={48} className="text-slate-500" />
              </div>
            )}
          </div>

          {/* Remote Videos */}
          {participants.map((participant) => (
            <div key={participant.id} className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={setRemoteVideoRef(participant.id)}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded text-xs text-white flex items-center gap-1">
                {participant.name}
                {participant.isMuted && <VolumeX size={12} />}
              </div>
              {participant.isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-dark-bg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-sui-cyan/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-sui-cyan">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{participant.name}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center justify-center gap-3">
          {/* Microphone */}
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-all ${
              isAudioOn
                ? 'bg-dark-bg hover:bg-white/10 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            title={isAudioOn ? 'Mute' : 'Unmute'}
          >
            {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* Camera */}
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-all ${
              isVideoOn
                ? 'bg-dark-bg hover:bg-white/10 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-full transition-all ${
              isScreenSharing
                ? 'bg-sui-cyan text-black'
                : 'bg-dark-bg hover:bg-white/10 text-white'
            }`}
            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
          >
            {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
          </button>

          {/* Hang Up */}
          <button
            onClick={handleDisconnect}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all"
            title="Leave call"
          >
            <PhoneOff size={20} />
          </button>
        </div>

        {/* Connection Info */}
        <div className="mt-3 text-center">
          <p className="text-xs text-slate-400">
            {isConnected ? (
              <>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Connected • Room: {roomId}
              </>
            ) : (
              'Connecting...'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoChat;
