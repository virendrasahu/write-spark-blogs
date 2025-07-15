
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, PenTool } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PenTool className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SparkBlogs</h1>
          </div>
          
          <nav className="flex items-center gap-4">
            <Button
              variant={activeTab === 'write' ? 'default' : 'ghost'}
              onClick={() => onTabChange('write')}
            >
              Write
            </Button>
            <Button
              variant={activeTab === 'blogs' ? 'default' : 'ghost'}
              onClick={() => onTabChange('blogs')}
            >
              My Blogs
            </Button>
            
            <div className="flex items-center gap-2 ml-4 pl-4 border-l">
              <span className="text-sm text-gray-600">
                Welcome, {user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
