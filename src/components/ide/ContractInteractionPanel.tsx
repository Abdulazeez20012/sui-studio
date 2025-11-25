import React, { useState } from 'react';
import { Code, Play, Eye, FileText, Activity, Box } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { TransactionBlock } from '@mysten/sui.js/transactions';

interface ContractFunction {
  name: string;
  parameters: { name: string; type: string }[];
  isEntry: boolean;
}

export const ContractInteractionPanel: React.FC = () => {
  const { connected, account, signAndExecuteTransaction, client } = useWallet();
  const [activeTab, setActiveTab] = useState<'call' | 'view' | 'events' | 'objects'>('call');
  
  // Call Function Tab
  const [packageId, setPackageId] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [functionName, setFunctionName] = useState('');
  const [functionArgs, setFunctionArgs] = useState('');
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // View State Tab
  const [objectId, setObjectId] = useState('');
  const [objectData, setObjectData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Events Tab
  const [events, setEvents] = useState<any[]>([]);
  
  // Objects Tab
  const [ownedObjects, setOwnedObjects] = useState<any[]>([]);

  const tabs = [
    { id: 'call', label: 'Call Function', icon: Play },
    { id: 'view', label: 'View State', icon: Eye },
    { id: 'events', label: 'Events', icon: Activity },
    { id: 'objects', label: 'Objects', icon: Box },
  ];

  // Execute contract function
  const executeFunction = async () => {
    if (!connected || !account) {
      setResult({ error: 'Please connect your wallet first' });
      return;
    }

    if (!packageId || !moduleName || !functionName) {
      setResult({ error: 'Please fill in all required fields' });
      return;
    }

    setExecuting(true);
    setResult(null);

    try {
      const tx = new TransactionBlock();
      
      // Parse arguments
      let args: any[] = [];
      if (functionArgs.trim()) {
        try {
          args = JSON.parse(functionArgs);
        } catch {
          args = functionArgs.split(',').map(arg => arg.trim());
        }
      }

      // Build transaction
      tx.moveCall({
        target: `${packageId}::${moduleName}::${functionName}`,
        arguments: args.map(arg => tx.pure(arg)),
      });

      // Execute transaction
      const response = await signAndExecuteTransaction(tx);
      
      setResult({
        success: true,
        digest: response.digest,
        effects: response.effects,
        events: response.events,
      });
    } catch (error: any) {
      setResult({
        error: error.message || 'Transaction failed',
      });
    } finally {
      setExecuting(false);
    }
  };

  // Fetch object data
  const fetchObjectData = async () => {
    if (!objectId) return;

    setLoading(true);
    setObjectData(null);

    try {
      const data = await client.getObject({
        id: objectId,
        options: {
          showContent: true,
          showOwner: true,
          showType: true,
        },
      });
      setObjectData(data);
    } catch (error: any) {
      setObjectData({ error: error.message || 'Failed to fetch object' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch owned objects
  const fetchOwnedObjects = async () => {
    if (!connected || !account) return;

    setLoading(true);
    try {
      const objects = await client.getOwnedObjects({
        owner: account.address,
      });
      setOwnedObjects(objects.data);
    } catch (error) {
      console.error('Failed to fetch objects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events
  const fetchEvents = async () => {
    if (!packageId) return;

    setLoading(true);
    try {
      const eventData = await client.queryEvents({
        query: { MoveModule: { package: packageId, module: moduleName } },
      });
      setEvents(eventData.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="h-full bg-black border-l border-gray-800 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <Code className="w-12 h-12 text-gray-600 mx-auto" />
          <h4 className="text-white font-semibold">Wallet Not Connected</h4>
          <p className="text-sm text-gray-400">
            Connect your wallet to interact with smart contracts
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black border-l border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-cyan-400" />
          <h3 className="text-white font-semibold">Contract Interaction</h3>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Call Function Tab */}
        {activeTab === 'call' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Package ID
              </label>
              <input
                type="text"
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Module Name
              </label>
              <input
                type="text"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                placeholder="my_module"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Function Name
              </label>
              <input
                type="text"
                value={functionName}
                onChange={(e) => setFunctionName(e.target.value)}
                placeholder="my_function"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Arguments (JSON array or comma-separated)
              </label>
              <textarea
                value={functionArgs}
                onChange={(e) => setFunctionArgs(e.target.value)}
                placeholder='["arg1", 123, true] or arg1, 123, true'
                rows={3}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <button
              onClick={executeFunction}
              disabled={executing}
              className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              {executing ? 'Executing...' : 'Execute Function'}
            </button>

            {result && (
              <div className={`p-4 rounded border ${
                result.error
                  ? 'bg-red-500/10 border-red-500/20'
                  : 'bg-green-500/10 border-green-500/20'
              }`}>
                <h4 className={`text-sm font-semibold mb-2 ${
                  result.error ? 'text-red-400' : 'text-green-400'
                }`}>
                  {result.error ? 'Error' : 'Success'}
                </h4>
                <pre className="text-xs text-gray-300 overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* View State Tab */}
        {activeTab === 'view' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Object ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={objectId}
                  onChange={(e) => setObjectId(e.target.value)}
                  placeholder="0x..."
                  className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={fetchObjectData}
                  disabled={loading}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Fetch'}
                </button>
              </div>
            </div>

            {objectData && (
              <div className="p-4 bg-gray-900 rounded border border-gray-700">
                <h4 className="text-sm font-semibold text-white mb-2">Object Data</h4>
                <pre className="text-xs text-gray-300 overflow-x-auto">
                  {JSON.stringify(objectData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <button
              onClick={fetchEvents}
              disabled={loading}
              className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch Events'}
            </button>

            {events.length > 0 ? (
              <div className="space-y-2">
                {events.map((event, index) => (
                  <div key={index} className="p-3 bg-gray-900 rounded border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">
                      Event #{index + 1}
                    </div>
                    <pre className="text-xs text-gray-300 overflow-x-auto">
                      {JSON.stringify(event, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                No events found
              </div>
            )}
          </div>
        )}

        {/* Objects Tab */}
        {activeTab === 'objects' && (
          <div className="space-y-4">
            <button
              onClick={fetchOwnedObjects}
              disabled={loading}
              className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch My Objects'}
            </button>

            {ownedObjects.length > 0 ? (
              <div className="space-y-2">
                {ownedObjects.map((obj, index) => (
                  <div key={index} className="p-3 bg-gray-900 rounded border border-gray-700">
                    <div className="text-xs text-cyan-400 font-mono mb-1">
                      {obj.data?.objectId}
                    </div>
                    <div className="text-xs text-gray-400">
                      Type: {obj.data?.type || 'Unknown'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                No objects found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
