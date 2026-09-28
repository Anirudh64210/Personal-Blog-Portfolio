// The no-flash theme script. It runs inline in <head> before the stylesheet, so it
// cannot be a bundled module (those are deferred). Its sha256 is added to the CSP in
// astro.config.mjs from this same string, so editing it here keeps the hash in sync.
import { createHash } from "node:crypto";

export const THEME_SCRIPT =
  "(function(){var d=document.documentElement;d.classList.add('js');" +
  "try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);}catch(e){}})();";

export const THEME_SCRIPT_HASH = "sha256-" + createHash("sha256").update(THEME_SCRIPT).digest("base64");
