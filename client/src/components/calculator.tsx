import { useState, useEffect } from 'react';
import { Sun, Moon, Mic, Upload, X, Copy, Check, Info, User, FileText, MessageCircle, Lightbulb, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/components/ui/theme-provider';
import { AboutModal, InfoModal, ContactModal, ApiInfoModal } from './modals';
import { TEXT_MODELS, VOICE_MODELS, InputType, TextModel, VoiceModel } from '@/lib/models';
import { estimateTokensFromText, calculateCost, copyToClipboard } from '@/lib/calculator';

export function Calculator() {
  const { theme, setTheme } = useTheme();
  const [inputType, setInputType] = useState<InputType>('text');
  const [currentModel, setCurrentModel] = useState<TextModel | VoiceModel>(TEXT_MODELS[0]);
  const [textInput, setTextInput] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState('');
  const [estimatedTokens, setEstimatedTokens] = useState(0);
  const [cost, setCost] = useState(0);
  const [copied, setCopied] = useState(false);

  // Modal states
  const [aboutOpen, setAboutOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [apiInfoOpen, setApiInfoOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleInputTypeChange = (type: InputType) => {
    setInputType(type);
    const models = type === 'voice' ? VOICE_MODELS : TEXT_MODELS;
    setCurrentModel(models[0]);
    setTextInput('');
    setTokenInput('');
    setUploadedFile(null);
    setTranscription('');
  };

  const handleModelChange = (modelId: string) => {
    const models = inputType === 'voice' ? VOICE_MODELS : TEXT_MODELS;
    const selectedModel = models.find(m => m.id === modelId);
    if (selectedModel) {
      setCurrentModel(selectedModel);
    }
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Mock recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        const mockTranscription = "This is a mock transcription from voice input.";
        setTranscription(mockTranscription);
        setTextInput(mockTranscription);
      }, 3000);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type.startsWith('audio/') || file.type.startsWith('video/'))) {
      setUploadedFile(file);
      setTextInput('');
      setTranscription('');
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    if (document.getElementById('file-upload') as HTMLInputElement) {
      (document.getElementById('file-upload') as HTMLInputElement).value = '';
    }
  };

  const handleCopy = async () => {
    const output = `Kitna? - AI Cost Calculation
Model: ${currentModel.name}
${inputType === 'voice' ? 'Estimated Duration' : 'Tokens'}: ${estimatedTokens.toLocaleString()}${inputType === 'voice' ? ' minutes' : ''}
Rate: ${currentModel.displayPrice}
Total Cost: $${cost.toFixed(6)}`;

    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  // Update calculations
  useEffect(() => {
    let tokens = 0;
    
    if (inputType === 'text' && textInput) {
      tokens = estimateTokensFromText(textInput);
    } else if (inputType === 'tokens' && tokenInput) {
      tokens = parseInt(tokenInput) || 0;
    } else if (inputType === 'voice') {
      if (textInput || transcription) {
        tokens = estimateTokensFromText(textInput || transcription);
      } else if (uploadedFile) {
        const fileSizeMB = uploadedFile.size / (1024 * 1024);
        const estimatedMinutes = Math.max(1, fileSizeMB / 1);
        tokens = estimatedMinutes * 200;
      }
    }
    
    setEstimatedTokens(tokens);
    setCost(calculateCost(tokens, inputType, currentModel));
  }, [textInput, tokenInput, inputType, currentModel, uploadedFile, transcription]);

  // Session storage for API key
  useEffect(() => {
    const savedApiKey = sessionStorage.getItem('apiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('apiKey', apiKey);
  }, [apiKey]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 backdrop-blur-sm bg-background/95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-medium text-primary">
              Kitna?
            </h1>
            <span className="hidden sm:inline ml-2 text-sm text-muted-foreground">
              AI Cost Calculator
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <Moon className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Calculator */}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="mb-2 text-xl md:text-2xl font-medium">AI Token Cost Calculator</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Calculate the cost of your AI model usage in real-time. Support for text, tokens, and voice input.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
          {/* Input Type Selection */}
          <div className="space-y-3">
            <label className="block font-medium">Input Type</label>
            <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 sm:gap-0">
              <Button
                variant={inputType === 'text' ? 'default' : 'outline'}
                onClick={() => handleInputTypeChange('text')}
                className="flex-1"
              >
                Text
              </Button>
              <Button
                variant={inputType === 'tokens' ? 'default' : 'outline'}
                onClick={() => handleInputTypeChange('tokens')}
                className="flex-1"
              >
                Tokens
              </Button>
              <Button
                variant={inputType === 'voice' ? 'default' : 'outline'}
                onClick={() => handleInputTypeChange('voice')}
                className="flex-1"
              >
                Voice
              </Button>
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
            <label className="block font-medium">
              {inputType === 'voice' ? 'Voice AI Model' : 'Text AI Model'}
            </label>
            <Select value={currentModel.id} onValueChange={handleModelChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(inputType === 'voice' ? VOICE_MODELS : TEXT_MODELS).map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name} ({model.displayPrice})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Input Area */}
          <div className="space-y-3">
            <label className="block font-medium">
              {inputType === 'text' ? 'Enter your text' : 
               inputType === 'tokens' ? 'Number of tokens' : 'Voice input'}
            </label>
            
            {inputType === 'text' && (
              <Textarea
                placeholder="Type your text here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-32 resize-none"
              />
            )}

            {inputType === 'tokens' && (
              <Input
                type="number"
                placeholder="Enter number of tokens"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                min="0"
              />
            )}

            {inputType === 'voice' && (
              <div className="space-y-4">
                {/* Voice Recording */}
                <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg bg-card">
                  <Button
                    onClick={handleVoiceRecording}
                    size="lg"
                    className={`rounded-full h-16 w-16 ${isRecording ? 'recording-pulse bg-destructive hover:bg-destructive/90' : ''}`}
                    variant={isRecording ? 'destructive' : 'default'}
                  >
                    <Mic className="h-6 w-6" />
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                  </p>
                  {transcription && (
                    <div className="w-full p-3 border rounded-lg bg-card">
                      <p className="text-sm">{transcription}</p>
                    </div>
                  )}
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Or upload audio file</p>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> audio file
                        </p>
                        <p className="text-xs text-muted-foreground">MP3, WAV, or other audio formats</p>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        accept="audio/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {uploadedFile && (
                    <div className="mt-2 p-3 border rounded-lg bg-card flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{uploadedFile.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeUploadedFile}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cost Calculation Output */}
          <div className="bg-card rounded-lg p-6 relative border">
            {/* Copy button in top-right corner */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="absolute top-4 right-4 h-8 w-8"
            >
              {copied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>

            {/* Header */}
            <h3 className="text-lg font-medium mb-4">Cost Calculation</h3>

            {/* Grid Layout */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {/* Row 1: Labels */}
              <div className="text-sm text-muted-foreground">Estimated Tokens</div>
              <div className="text-sm text-muted-foreground">Model</div>
              
              {/* Row 2: Values */}
              <div className="text-lg font-medium">{estimatedTokens.toLocaleString()}</div>
              <div className="text-lg font-medium">{currentModel.name}</div>
              
              {/* Row 3: Labels */}
              <div className="text-sm text-muted-foreground">Rate per 1k tokens</div>
              <div className="text-sm text-muted-foreground">Total Cost</div>
              
              {/* Row 4: Values */}
              <div className="text-base">{currentModel.displayPrice}</div>
              <div className="text-lg font-medium text-primary">${cost.toFixed(6)}</div>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <label className="block font-medium">Your API</label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setApiInfoOpen(true)}
                className="h-6 w-6 p-0"
              >
                <Info className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <Input
              type="password"
              placeholder="Enter your API key (stored for session only)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally for this session only and will be removed when you close the tab.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-8">
          {/* Footer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div 
              className="bg-card rounded-lg p-4 md:p-6 hover:bg-accent/50 transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98] border"
              onClick={() => setAboutOpen(true)}
            >
              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-primary group-hover:text-primary/80 transition-colors flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium group-hover:text-accent-foreground transition-colors">
                    About
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Learn more about Kitna? and our mission to simplify AI cost calculations.
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="bg-card rounded-lg p-4 md:p-6 hover:bg-accent/50 transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98] border"
              onClick={() => setInfoOpen(true)}
            >
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-primary group-hover:text-primary/80 transition-colors flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium group-hover:text-accent-foreground transition-colors">
                    Info
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Get detailed information about AI models, pricing, and token calculations.
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="bg-card rounded-lg p-4 md:p-6 hover:bg-accent/50 transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98] border"
              onClick={() => setContactOpen(true)}
            >
              <div className="flex items-start space-x-3">
                <MessageCircle className="h-5 w-5 text-primary group-hover:text-primary/80 transition-colors flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium group-hover:text-accent-foreground transition-colors">
                    Contact
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Have questions or feedback? We'd love to hear from you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-6 border-t">
            <p className="text-xs text-muted-foreground">
              © 2025 Kitna? - AI Token Cost Calculator. Made by Yours Truly, Shaheryar Shakeel.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
      <InfoModal isOpen={infoOpen} onClose={() => setInfoOpen(false)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <ApiInfoModal isOpen={apiInfoOpen} onClose={() => setApiInfoOpen(false)} />
    </div>
  );
}
