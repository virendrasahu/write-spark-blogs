
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Save, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BlogEditorProps {
  onSave: () => void;
  editingBlog?: {
    id: string;
    title: string;
    content: string;
    topic: string | null;
  } | null;
}

const BlogEditor = ({ onSave, editingBlog }: BlogEditorProps) => {
  const [title, setTitle] = useState(editingBlog?.title || '');
  const [content, setContent] = useState(editingBlog?.content || '');
  const [topic, setTopic] = useState(editingBlog?.topic || '');
  const [aiPrompt, setAiPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const { toast } = useToast();

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for AI generation",
        variant: "destructive",
      });
      return;
    }

    setAiGenerating(true);
    try {
      // This is a placeholder for AI integration
      // In a real implementation, you would call OpenAI API here
      const simulatedAIContent = `# ${aiPrompt}

This is AI-generated content based on your prompt: "${aiPrompt}"

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Key Points

- Point one about ${aiPrompt}
- Another important aspect
- Detailed analysis and insights
- Conclusion and recommendations

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

      setContent(simulatedAIContent);
      if (!title) {
        setTitle(aiPrompt);
      }
      if (!topic) {
        setTopic(aiPrompt.split(' ')[0]);
      }
      
      toast({
        title: "AI Content Generated!",
        description: "Your blog content has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "AI Generation Failed",
        description: "Unable to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save blogs",
          variant: "destructive",
        });
        return;
      }

      if (editingBlog) {
        const { error } = await supabase
          .from('blogs')
          .update({
            title,
            content,
            topic: topic || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingBlog.id);

        if (error) throw error;

        toast({
          title: "Blog Updated!",
          description: "Your blog post has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert({
            title,
            content,
            topic: topic || null,
            user_id: user.id,
          });

        if (error) throw error;

        toast({
          title: "Blog Saved!",
          description: "Your blog post has been saved successfully.",
        });
      }

      setTitle('');
      setContent('');
      setTopic('');
      setAiPrompt('');
      onSave();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save your blog. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Blog Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter a topic or prompt for AI generation..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />
          <Button 
            onClick={generateWithAI} 
            disabled={aiGenerating}
            className="w-full"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            {aiGenerating ? "Generating..." : "Generate with AI"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {editingBlog ? 'Edit Blog Post' : 'Write New Blog Post'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="Topic (optional)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          
          <Textarea
            placeholder="Write your blog content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px]"
          />

          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : editingBlog ? "Update Blog" : "Save Blog"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogEditor;
