
export interface EnvStatus {
  isWeChat: boolean;
  isAlipay: boolean;
  isMiniProgram: boolean;
  platform: 'wechat' | 'alipay' | 'web';
}

export const getEnv = (): EnvStatus => {
  const ua = navigator.userAgent.toLowerCase();
  
  const isWeChat = ua.indexOf('micromessenger') !== -1;
  const isAlipay = ua.indexOf('alipayclient') !== -1;
  
  // WeChat Mini Program specific detection
  // 1. window.__wxjs_environment variable
  // 2. 'miniprogram' string in UserAgent
  const isWxMiniProgram = (window as any).__wxjs_environment === 'miniprogram' || ua.indexOf('miniprogram') !== -1;
  
  // Alipay Mini Program specific detection
  const isAlipayMiniProgram = isAlipay && ua.indexOf('miniprogram') !== -1;

  let platform: 'wechat' | 'alipay' | 'web' = 'web';
  if (isWeChat) platform = 'wechat';
  if (isAlipay) platform = 'alipay';

  return {
    isWeChat,
    isAlipay,
    isMiniProgram: isWxMiniProgram || isAlipayMiniProgram,
    platform
  };
};
