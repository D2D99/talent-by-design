import React, { useMemo, useState } from "react";

interface TopicSelectorModalProps {
  initialSelectedTopics?: string[];
  onSave: (selectedTopics: string[]) => void;
  onClose: () => void;
}

const TOPICS = [
  "Organizational Health",
  "POD-360™ Model",
  "Trends Analysis",
  "Alignment Status",
  "Priorities Attention",
  "Overall Departmental POD Score",
  "Score by domain",
  "Score by sub-domain",
  "Performance Analysis",
  "Insight for People Potential",
  "Objectives and Key Results",
];

const TopicSelectorModal: React.FC<TopicSelectorModalProps> = ({
  initialSelectedTopics = [],
  onSave,
  onClose,
}) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialSelectedTopics);

  const isAllSelected = useMemo(
    () => TOPICS.length > 0 && selectedTopics.length === TOPICS.length,
    [selectedTopics],
  );

  const handleTopicChange = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((item) => item !== topic) : [...prev, topic],
    );
  };

  const handleToggleAll = () => {
    setSelectedTopics(isAllSelected ? [] : [...TOPICS]);
  };

  const handleSave = () => {
    onSave(selectedTopics);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#08111f]/60 px-4">
      <div className="w-full max-w-2xl rounded-[24px] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1a3652]">Select Topics For PDF</h2>
            <p className="mt-2 text-sm text-[#5d6b82]">
              Jo topics select karoge, wahi PDF report me show honge.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#d8e5f2] px-3 py-1 text-sm font-medium text-[#1a3652]"
          >
            Close
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#f3f8fd] px-4 py-3">
          <p className="text-sm font-medium text-[#1a3652]">
            {selectedTopics.length} topic selected
          </p>
          <button
            type="button"
            onClick={handleToggleAll}
            className="text-sm font-semibold text-[#2f78bf]"
          >
            {isAllSelected ? "Clear All" : "Select All"}
          </button>
        </div>

        <div className="mt-5 grid max-h-[380px] grid-cols-1 gap-3 overflow-y-auto pr-2 md:grid-cols-2">
          {TOPICS.map((topic) => (
            <label
              key={topic}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#dbe6f1] px-4 py-3 transition hover:border-[#2f78bf] hover:bg-[#f8fbfe]"
            >
              <input
                type="checkbox"
                checked={selectedTopics.includes(topic)}
                onChange={() => handleTopicChange(topic)}
                className="mt-1 h-4 w-4 accent-[#2f78bf]"
              />
              <span className="text-sm font-medium text-[#1a3652]">{topic}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#d8e5f2] px-5 py-2 text-sm font-semibold text-[#1a3652]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={selectedTopics.length === 0}
            className="rounded-full bg-gradient-to-r from-[#1a3652] to-[#448bd2] px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicSelectorModal;
