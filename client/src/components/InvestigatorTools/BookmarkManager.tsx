import { useState } from 'react';
import useWalletTags from '../../hooks/useWalletTags';

interface BookmarkManagerProps {
  walletAddress: string;
}

export default function BookmarkManager({ walletAddress }: BookmarkManagerProps) {
  const { tags, addTag, removeTag } = useWalletTags(walletAddress);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="bookmark-manager">
      <h4>Wallet Tags</h4>
      <div className="tags-list">
        {tags.map((tag) => (
          <div key={tag.id} className="tag">
            {tag.name}
            <button onClick={() => removeTag(tag.id)}>×</button>
          </div>
        ))}
      </div>
      <div className="add-tag">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add tag..."
        />
        <button onClick={handleAddTag}>Add</button>
      </div>
    </div>
  );
}