
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import BlogEditor from '@/components/blog/BlogEditor';
import BlogList from '@/components/blog/BlogList';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('write');
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [refreshBlogs, setRefreshBlogs] = useState(false);

  const handleSave = () => {
    setRefreshBlogs(!refreshBlogs);
    setEditingBlog(null);
    setActiveTab('blogs');
  };

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setActiveTab('write');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'write') {
      setEditingBlog(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'write' && (
          <BlogEditor 
            onSave={handleSave} 
            editingBlog={editingBlog}
          />
        )}
        
        {activeTab === 'blogs' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Blog Posts</h2>
            <BlogList 
              onEdit={handleEdit}
              refresh={refreshBlogs}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
