
export const checkCookiesEnabled = (): boolean => {
  try {
    document.cookie = "test=1; SameSite=Strict";
    const cookieEnabled = document.cookie.indexOf("test=") !== -1;
    
    // Pulisce il cookie di test
    if (cookieEnabled) {
      document.cookie = "test=1; expires=Thu, 01-Jan-1970 00:00:01 GMT; SameSite=Strict";
    }
    
    return cookieEnabled;
  } catch (e) {
    return false;
  }
};

export const checkJavaScriptEnabled = (): boolean => {
  // Se questa funzione viene eseguita, JavaScript è abilitato
  return true;
};
