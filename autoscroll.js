import { text } from "express";

  const textarea = document.getElementById('content');
  if(textarea){
textarea.addEventListener('input', () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'   // smooth scroll
  });
});
  }
