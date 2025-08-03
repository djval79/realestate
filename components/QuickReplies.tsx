import React from 'react';

const replies = [
  "Make it more concise",
  "Add more emojis 🤩",
  "Sound more professional",
  "Explain the ROI simply",
];

interface QuickRepliesProps {
  onSelectReply: (reply: string) => void;
  disabled: boolean;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ onSelectReply, disabled }) => {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Quick Replies</p>
      <div className="flex flex-wrap gap-2">
        {replies.map((reply) => (
          <button
            key={reply}
            onClick={() => onSelectReply(reply)}
            disabled={disabled}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-cyan-200 dark:hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplies;