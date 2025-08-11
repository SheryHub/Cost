import { TextModel, VoiceModel, InputType } from './models';

export function estimateTokensFromText(text: string): number {
  if (!text.trim()) return 0;
  
  const normalized = text.trim().replace(/\s+/g, ' ');
  const words = normalized.split(/\s+/);
  let tokenCount = 0;
  
  for (const word of words) {
    if (!word) continue;
    
    if (word.length <= 4 && /^[a-zA-Z]+$/.test(word)) {
      tokenCount += 1;
    } else if (word.length <= 8) {
      tokenCount += Math.ceil(word.length / 4);
    } else {
      tokenCount += Math.ceil(word.length / 3.5);
    }
    
    const punctuationCount = (word.match(/[^\w\s]/g) || []).length;
    tokenCount += punctuationCount * 0.3;
  }
  
  const newlines = (text.match(/\n/g) || []).length;
  tokenCount += newlines * 0.5;
  
  return Math.ceil(tokenCount);
}

export function calculateCost(
  tokens: number,
  inputType: InputType,
  model: TextModel | VoiceModel
): number {
  if (inputType === 'voice') {
    const voiceModel = model as VoiceModel;
    const estimatedMinutes = Math.max(1, tokens / 200);
    
    if (voiceModel.unit === 'minute') {
      return estimatedMinutes * voiceModel.inputPrice;
    } else if (voiceModel.unit === 'hour') {
      return (estimatedMinutes / 60) * voiceModel.inputPrice;
    } else if (voiceModel.unit === 'second') {
      return (estimatedMinutes * 60) * voiceModel.inputPrice;
    } else if (voiceModel.unit === '1000 minutes') {
      return (estimatedMinutes / 1000) * voiceModel.inputPrice;
    }
  }
  
  const textModel = model as TextModel;
  return (tokens / 1000) * textModel.inputPrice;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  let copySuccessful = false;

  // Try fallback method first
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);
    
    copySuccessful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (copySuccessful) {
      return true;
    }
  } catch (err) {
    console.warn('Fallback copy method failed:', err);
  }

  // Try modern clipboard API
  if (!copySuccessful) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      console.warn('Modern clipboard API failed:', err);
    }
  }

  return false;
}
