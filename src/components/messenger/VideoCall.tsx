import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  isVideoCall: boolean;
}

export default function VideoCall({ isOpen, onClose, contactName, isVideoCall }: VideoCallProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(isVideoCall);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      startCall();
    } else {
      stopCall();
    }

    return () => {
      stopCall();
    };
  }, [isOpen]);

  const startCall = async () => {
    try {
      const constraints = {
        audio: true,
        video: isVideoCall ? { width: 1280, height: 720 } : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      if (localVideoRef.current && isVideoCall) {
        localVideoRef.current.srcObject = stream;
      }

      setIsCallActive(true);
      toast({ 
        title: isVideoCall ? 'Видеозвонок' : 'Аудиозвонок', 
        description: `Звоним ${contactName}...` 
      });

      setTimeout(() => {
        if (remoteVideoRef.current && isVideoCall) {
          remoteVideoRef.current.srcObject = stream;
        }
        toast({ 
          title: 'Соединение установлено', 
          description: `${contactName} в сети` 
        });
      }, 2000);

    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({ 
        title: 'Ошибка', 
        description: 'Не удалось получить доступ к камере/микрофону', 
        variant: 'destructive' 
      });
      onClose();
    }
  };

  const stopCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    setIsCallActive(false);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const handleEndCall = () => {
    stopCall();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
        <div className="relative h-full bg-card flex flex-col">
          {isVideoCall && isVideoEnabled ? (
            <div className="flex-1 relative bg-black">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="absolute bottom-4 right-4 w-48 h-36 object-cover rounded-lg border-2 border-primary shadow-lg"
              />

              <div className="absolute top-4 left-4 bg-black/50 px-4 py-2 rounded-full">
                <p className="text-white font-medium">{contactName}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <div className="text-center">
                <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="User" size={64} className="text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{contactName}</h2>
                <p className="text-muted-foreground">
                  {isCallActive ? 'Звонок идет...' : 'Соединение...'}
                </p>
              </div>
            </div>
          )}

          <div className="p-6 bg-card border-t border-border">
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant={isMuted ? "destructive" : "secondary"}
                size="icon"
                className="rounded-full h-14 w-14"
                onClick={toggleMute}
              >
                <Icon name={isMuted ? "MicOff" : "Mic"} size={24} />
              </Button>

              {isVideoCall && (
                <Button
                  variant={isVideoEnabled ? "secondary" : "destructive"}
                  size="icon"
                  className="rounded-full h-14 w-14"
                  onClick={toggleVideo}
                >
                  <Icon name={isVideoEnabled ? "Video" : "VideoOff"} size={24} />
                </Button>
              )}

              <Button
                variant="destructive"
                size="icon"
                className="rounded-full h-16 w-16"
                onClick={handleEndCall}
              >
                <Icon name="PhoneOff" size={28} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
