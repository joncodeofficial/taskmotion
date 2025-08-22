export const calculateHeight = (textareaRef: React.MutableRefObject<HTMLTextAreaElement>) => {
  textareaRef.current.style.height = 'auto';
  textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
};

export const resetHeight = (textareaRef: React.MutableRefObject<HTMLTextAreaElement>) => {
  textareaRef.current.style.height = 'auto';
};
