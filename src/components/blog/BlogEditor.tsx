
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
      console.log('Calling Gemini AI with prompt:', aiPrompt);

      const { data, error } = await supabase.functions.invoke('generate-blog-content', {
        body: { prompt: aiPrompt }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate content');
      }

      if (!data || !data.content) {
        throw new Error('No content received from AI');
      }

      console.log('AI content generated successfully');

      setContent(data.content);
      
      // Auto-fill title and topic if they're empty
      if (!title.trim()) {
        // Extract title from the first line of generated content
        const firstLine = data.content.split('\n')[0];
        const extractedTitle = firstLine.replace(/^#+\s*/, '').trim();
        if (extractedTitle) {
          setTitle(extractedTitle);
        } else {
          setTitle(aiPrompt);
        }
      }
      
      if (!topic.trim()) {
        // Use the first word or phrase from the prompt as topic
        const topicFromPrompt = aiPrompt.split(' ').slice(0, 2).join(' ');
        setTopic(topicFromPrompt);
      }
      
      toast({
        title: "AI Content Generated!",
        description: "Your blog content has been generated successfully.",
      });
    } catch (error) {
      console.error('AI generation error:', error);
      toast({
        title: "AI Generation Failed",
        description: error.message || "Unable to generate content. Please try again.",
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
            {aiGenerating ? "Generating with Gemini AI..." : "Generate with AI"}
          </Button>
          {aiGenerating && (
            <div className="text-sm text-gray-600 text-center">
              Using Google Gemini AI to create your blog content...
            </div>
          )}
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
