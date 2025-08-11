import { useState } from 'react';
import { X, Copy, Check, Shield, Key, Coffee, Code, Heart, Sparkles, DollarSign, Zap, MessageSquare, Mic, Mail, ExternalLink, Info, User, Lightbulb, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TEXT_MODELS, VOICE_MODELS } from '@/lib/models';
import { copyToClipboard } from '@/lib/calculator';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-card text-card-foreground rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto border">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-medium">About Kitna?</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* App Story */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-3">The Story Behind "Kitna?"</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              "Kitna?" is Roman Urdu for "How much?" - a question I found myself asking constantly 
              while working with various AI APIs. Every time I wanted to test a prompt or process 
              some text, I had to manually calculate the potential costs.
            </p>
          </div>

          {/* Why It Was Built */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Coffee className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Born from Necessity</h4>
                <p className="text-xs text-muted-foreground">
                  As a developer constantly experimenting with AI models, I needed a quick way to 
                  estimate costs before making API calls. Manual calculations were tedious and error-prone.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Code className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Built for Developers</h4>
                <p className="text-xs text-muted-foreground">
                  Designed with developers in mind, supporting multiple input methods and providing 
                  accurate estimates for informed decision-making.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Heart className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Made with Care</h4>
                <p className="text-xs text-muted-foreground">
                  Privacy-first approach with all calculations happening locally. No registration 
                  required, no data collected.
                </p>
              </div>
            </div>
          </div>

          {/* Developer Info */}
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <h4 className="font-medium mb-2">About the Developer</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Built by a passionate developer who believes in creating tools that solve real problems. 
              This project started as a personal need and evolved into something that could help 
              the entire AI development community.
            </p>
          </div>

          {/* Version & Tech */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>Version 1.3.8</p>
            <p>Built with React, TypeScript, Tailwind CSS, FastAPI and Python</p>
            <p className="text-primary">Made by Yours Truly, Shaheryar Shakeel</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InfoModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-card text-card-foreground rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-medium">App Information</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Features */}
          <div>
            <h3 className="text-lg font-medium mb-4">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Smart Token Estimation</h4>
                  <p className="text-xs text-muted-foreground mt-1">Enhanced estimation algorithm that closely approximates official tokenizers</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <DollarSign className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Real-time Pricing</h4>
                  <p className="text-xs text-muted-foreground mt-1">Up-to-date pricing information from all major AI providers</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Multiple Input Types</h4>
                  <p className="text-xs text-muted-foreground mt-1">Support for text, token count, and voice input methods</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Privacy First</h4>
                  <p className="text-xs text-muted-foreground mt-1">All calculations happen locally, no data sent to servers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text AI Models */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Supported Text AI Models</h3>
            </div>
            <div className="space-y-3">
              {TEXT_MODELS.map((model) => (
                <div key={model.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{model.name}</h4>
                    <span className="text-sm text-primary font-medium">{model.displayPrice}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Provider: {model.provider}</p>
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Voice AI Models */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mic className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Supported Voice AI Models</h3>
            </div>
            <div className="space-y-3">
              {VOICE_MODELS.map((model) => (
                <div key={model.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{model.name}</h4>
                    <span className="text-sm text-primary font-medium">{model.displayPrice}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Provider: {model.provider}</p>
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Token Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Understanding Tokens & Usage</h3>
            <div className="space-y-4">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p><strong>For Text Models:</strong></p>
                <p>
                  Tokens are the basic units that AI models use to process text. Generally:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>1 token ≈ 4 characters of English text</li>
                  <li>1 token ≈ ¾ of a word</li>
                  <li>100 tokens ≈ 75 words</li>
                  <li>1,000 tokens ≈ 750 words</li>
                </ul>
              </div>
              
              <div className="space-y-3 text-sm text-muted-foreground">
                <p><strong>For Voice Models:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Pricing is typically per minute, hour, or second of audio</li>
                  <li>Audio quality and language can affect accuracy</li>
                  <li>Most services support multiple audio formats</li>
                  <li>Real-time transcription may have different pricing</li>
                </ul>
              </div>
              
              <p className="text-xs">
                <strong>Note:</strong> Token counts may vary between models and languages. Our enhanced estimation algorithm provides accurate approximations for all models. Voice calculations are estimated based on typical speech patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactModal({ isOpen, onClose }: ModalProps) {
  const [emailCopied, setEmailCopied] = useState(false);
  const [linkedinCopied, setLinkedinCopied] = useState(false);

  const handleCopyEmail = async () => {
    const success = await copyToClipboard('shaheryar.smaqut@gmail.com');
    if (success) {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 1000);
    }
  };

  const handleCopyLinkedin = async () => {
    const success = await copyToClipboard('https://linkedin.com/in/shaheryarshakeelmalik');
    if (success) {
      setLinkedinCopied(true);
      setTimeout(() => setLinkedinCopied(false), 1000);
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-card text-card-foreground rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-medium">Contact Information</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Contact Header */}
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Get In Touch</h3>
            <p className="text-sm text-muted-foreground">
              Have questions, feedback, or want to collaborate? Feel free to reach out!
            </p>
          </div>

          {/* Contact Methods */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">Email</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyEmail}
                      className="h-7 w-7 p-0"
                    >
                      {emailCopied ? (
                        <Check className="h-3 w-3 text-primary" />
                      ) : (
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm font-mono break-all mb-1">
                    shaheryar.smaqut@gmail.com
                  </p>
                  <p className="text-xs text-muted-foreground">
                    For questions, feedback, or collaboration
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Linkedin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">LinkedIn</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyLinkedin}
                      className="h-7 w-7 p-0"
                    >
                      {linkedinCopied ? (
                        <Check className="h-3 w-3 text-primary" />
                      ) : (
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm font-mono break-all mb-1">
                    linkedin.com/in/shaheryarshakeelmalik
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Connect for professional networking
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <h4 className="font-medium text-sm mb-2">Response Time</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              I typically respond to emails within 24-48 hours. For urgent matters, 
              feel free to reach out via LinkedIn during business hours.
            </p>
          </div>

          {/* Footer Note */}
          <div className="text-center text-xs text-muted-foreground">
            <p>Looking forward to hearing from you!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ApiInfoModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-card text-card-foreground rounded-lg max-w-md w-full border">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-medium">API Key Information</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">Privacy & Security</h4>
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally in your browser session only. It will never be sent 
                to our servers and will be automatically deleted when you close this tab.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Key className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">Optional Feature</h4>
              <p className="text-xs text-muted-foreground">
                API key input is completely optional. The calculator works without it for cost estimation. 
                You can add it if you want to make actual API calls in the future.
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">
              We prioritize your privacy and security above all else.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
