import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Star, 
  Share2, 
  Bookmark,
  ChevronRight
} from "lucide-react";
import { editorialReviews, getRelatedEditorials } from "@/data/editorialData";

const EditorialDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const editorial = editorialReviews.find(e => e.slug === slug);
  
  if (!editorial) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">İnceleme Bulunamadı</h1>
          <p className="text-muted-foreground mb-8">Aradığınız inceleme mevcut değil.</p>
          <Link to="/incelemeler">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              İncelemelere Dön
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const relatedEditorials = getRelatedEditorials(editorial.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={editorial.coverImage}
          alt={editorial.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <Link 
              to="/incelemeler" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tüm İncelemeler
            </Link>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{editorial.category}</Badge>
              {editorial.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-4xl">
              {editorial.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={editorial.author.avatar} />
                  <AvatarFallback>{editorial.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-foreground font-medium">{editorial.author.name}</span>
                  <span className="hidden md:inline"> · {editorial.author.role}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(editorial.publishedAt)}
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {editorial.readTime}
              </div>
              
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="font-bold text-foreground">{editorial.rating}</span>
                <span>/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {editorial.excerpt}
              </p>
              
              <Separator className="my-8" />
              
              {/* Render content with markdown-like formatting */}
              <div className="space-y-6">
                {editorial.content.split('\n\n').map((paragraph, index) => {
                  // Headers
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-2xl font-bold mt-10 mb-4">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  
                  // Bold headers
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h3 key={index} className="text-xl font-semibold mt-6 mb-3">
                        {paragraph.replace(/\*\*/g, '')}
                      </h3>
                    );
                  }
                  
                  // Tables
                  if (paragraph.includes('|') && paragraph.includes('---')) {
                    const rows = paragraph.split('\n').filter(row => row.trim() && !row.includes('---'));
                    const headers = rows[0]?.split('|').filter(cell => cell.trim());
                    const dataRows = rows.slice(1);
                    
                    return (
                      <div key={index} className="overflow-x-auto my-6">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-border">
                              {headers?.map((header, i) => (
                                <th key={i} className="text-left p-3 font-semibold bg-muted/50">
                                  {header.trim()}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {dataRows.map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-b border-border">
                                {row.split('|').filter(cell => cell.trim()).map((cell, cellIndex) => (
                                  <td key={cellIndex} className="p-3">
                                    {cell.trim()}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  
                  // Lists
                  if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').filter(item => item.startsWith('- '));
                    return (
                      <ul key={index} className="list-disc list-inside space-y-2 my-4">
                        {items.map((item, i) => (
                          <li key={i} className="text-muted-foreground">
                            {item.replace('- ', '').replace(/\*\*/g, '')}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  
                  // Regular paragraphs
                  if (paragraph.trim()) {
                    return (
                      <p key={index} className="text-muted-foreground leading-relaxed">
                        {paragraph.replace(/\*\*/g, '')}
                      </p>
                    );
                  }
                  
                  return null;
                })}
              </div>
            </div>
            
            {/* Share & Save */}
            <div className="flex items-center gap-4 mt-12 pt-8 border-t border-border">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Paylaş
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Kaydet
              </Button>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Rating Card */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-4">Genel Değerlendirme</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl font-bold text-primary">{editorial.rating}</div>
                  <div className="text-sm text-muted-foreground">/10</div>
                </div>
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={i}
                      className={`h-2 flex-1 rounded-full ${
                        i < Math.floor(editorial.rating) ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Author Card */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-4">Yazar</h3>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={editorial.author.avatar} />
                    <AvatarFallback>{editorial.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{editorial.author.name}</div>
                    <div className="text-sm text-muted-foreground">{editorial.author.role}</div>
                  </div>
                </div>
              </div>
              
              {/* Related Reviews */}
              {relatedEditorials.length > 0 && (
                <div className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="font-semibold mb-4">Benzer İncelemeler</h3>
                  <div className="space-y-4">
                    {relatedEditorials.map((related) => (
                      <Link 
                        key={related.id}
                        to={`/inceleme/${related.slug}`}
                        className="group flex gap-3"
                      >
                        <img
                          src={related.coverImage}
                          alt={related.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                            {related.title}
                          </h4>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            {related.rating}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditorialDetail;
