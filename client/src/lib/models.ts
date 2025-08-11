export interface TextModel {
  id: string;
  name: string;
  inputPrice: number;
  outputPrice: number;
  displayPrice: string;
  provider: string;
  description: string;
}

export interface VoiceModel {
  id: string;
  name: string;
  inputPrice: number;
  outputPrice: number;
  unit: string;
  displayPrice: string;
  provider: string;
  description: string;
}

export const TEXT_MODELS: TextModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    inputPrice: 0.03,
    outputPrice: 0.06,
    displayPrice: '$0.03/1K tokens',
    provider: 'OpenAI',
    description: 'Most capable model, best for complex tasks'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    inputPrice: 0.001,
    outputPrice: 0.002,
    displayPrice: '$0.001/1K tokens',
    provider: 'OpenAI',
    description: 'Fast and cost-effective for most tasks'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    inputPrice: 0.015,
    outputPrice: 0.075,
    displayPrice: '$0.015/1K tokens',
    provider: 'Anthropic',
    description: 'Advanced reasoning and analysis capabilities'
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    inputPrice: 0.003,
    outputPrice: 0.015,
    displayPrice: '$0.003/1K tokens',
    provider: 'Anthropic',
    description: 'Balanced performance and cost'
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    inputPrice: 0.00025,
    outputPrice: 0.00125,
    displayPrice: '$0.00025/1K tokens',
    provider: 'Anthropic',
    description: 'Fastest and most affordable option'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    inputPrice: 0.0005,
    outputPrice: 0.0015,
    displayPrice: '$0.0005/1K tokens',
    provider: 'Google',
    description: 'Multimodal capabilities with competitive pricing'
  }
];

export const VOICE_MODELS: VoiceModel[] = [
  {
    id: 'whisper-1',
    name: 'OpenAI Whisper',
    inputPrice: 0.006,
    outputPrice: 0,
    unit: 'minute',
    displayPrice: '$0.006/minute',
    provider: 'OpenAI',
    description: 'Highly accurate speech-to-text with multilingual support'
  },
  {
    id: 'azure-speech',
    name: 'Azure Speech Services',
    inputPrice: 1.0,
    outputPrice: 0,
    unit: '1000 minutes',
    displayPrice: '$1.0/1000 minutes',
    provider: 'Microsoft',
    description: 'Enterprise-grade speech recognition and synthesis'
  },
  {
    id: 'google-speech',
    name: 'Google Speech-to-Text',
    inputPrice: 1.44,
    outputPrice: 0,
    unit: 'hour',
    displayPrice: '$1.44/hour',
    provider: 'Google',
    description: 'Advanced speech recognition with real-time processing'
  },
  {
    id: 'aws-transcribe',
    name: 'AWS Transcribe',
    inputPrice: 0.024,
    outputPrice: 0,
    unit: 'minute',
    displayPrice: '$0.024/minute',
    provider: 'Amazon',
    description: 'Scalable speech recognition service'
  },
  {
    id: 'assemblyai',
    name: 'AssemblyAI',
    inputPrice: 0.00037,
    outputPrice: 0,
    unit: 'second',
    displayPrice: '$0.00037/second',
    provider: 'AssemblyAI',
    description: 'AI-powered speech understanding platform'
  },
  {
    id: 'deepgram',
    name: 'Deepgram Nova-2',
    inputPrice: 0.0043,
    outputPrice: 0,
    unit: 'minute',
    displayPrice: '$0.0043/minute',
    provider: 'Deepgram',
    description: 'Ultra-fast and accurate speech recognition'
  }
];

export type InputType = 'text' | 'tokens' | 'voice';
