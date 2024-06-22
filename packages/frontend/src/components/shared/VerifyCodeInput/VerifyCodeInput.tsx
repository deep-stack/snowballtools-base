import { useEffect, useRef } from 'react';
import { Input } from '../Input';

export interface VerifyCodeInputProps {
  code: string;
  setCode: (code: string) => void;
  submitCode: () => void;
  loading: boolean;
}

export const VerifyCodeInput = ({
  code,
  setCode,
  submitCode,
  loading,
}: VerifyCodeInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    i: number,
  ) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, ''); // Only digits
    if (pasteData.length > 0) {
      let newCodeArray = code.split('');
      for (let j = 0; j < pasteData.length && i + j < 6; j++) {
        newCodeArray[i + j] = pasteData[j];
      }
      const newCode = newCodeArray.join('');
      setCode(newCode);
      const nextIndex = Math.min(i + pasteData.length, 5);
      const nextInput = inputRefs.current[nextIndex];
      if (nextInput) nextInput.focus();
      if (!newCode.includes(' ')) {
        submitCode();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number,
  ) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const isEmpty = code[i] === ' ';
      const newCode = !isEmpty
        ? code.slice(0, i) + ' ' + code.slice(i + 1, 6)
        : code.slice(0, i - 1) + ' ' + code.slice(i, 6);

      setCode(newCode.slice(0, 6));

      if (i === 0 || !isEmpty) return;
      const prev = inputRefs.current[i - 1];
      if (prev) prev.focus();
      return;
    }

    if (!e.key.match(/[0-9]/)) return;

    e.preventDefault(); // Prevent the default event to avoid duplicate input

    const newCode = code.slice(0, i) + e.key + code.slice(i + 1, 6);
    setCode(newCode);

    if (i === 5) {
      submitCode();
      return;
    }

    const next = inputRefs.current[i + 1];
    if (next) next.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const value = e.target.value.slice(-1);
    if (!value.match(/[0-9]/)) return;

    const newCode = code.slice(0, i) + value + code.slice(i + 1, 6);
    setCode(newCode);

    if (i < 5) {
      const next = inputRefs.current[i + 1];
      if (next) next.focus();
    }

    if (!newCode.includes(' ')) {
      submitCode();
    }
  };

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  return (
    <div className="flex gap-2">
      {code.split('').map((char, i) => (
        <Input
          key={i}
          value={char === ' ' ? '' : char}
          ref={(el) => (inputRefs.current[i] = el)}
          onChange={(e) => handleChange(e, i)}
          onPaste={(e) => handlePaste(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          disabled={!!loading}
          style={{ textAlign: 'center' }} // Add this line to center text
        />
      ))}
    </div>
  );
};
