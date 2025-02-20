
import { Calendar, ExternalLink, Tag, FileText } from "lucide-react";

interface LinkCardProps {
  title: string;
  url: string;
  tags: string[];
  date: string;
  fileName?: string;
  classification?: string;
  category?: string;
  summary?: string;
  isGrid: boolean;
}

export const LinkCard = ({ 
  title, 
  url, 
  tags, 
  date, 
  fileName, 
  classification,
  category,
  summary,
  isGrid 
}: LinkCardProps) => {
  const getHostname = (url: string) => {
    try {
      const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
      return new URL(urlWithProtocol).hostname;
    } catch (e) {
      return 'Invalid URL';
    }
  };

  const hostname = getHostname(url);

  return (
    <div
      className={`group animate-fade-in bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 ${
        isGrid ? "flex flex-col" : "flex items-start"
      }`}
    >
      <div
        className={`flex-1 p-4 ${
          isGrid ? "" : "flex items-start justify-between w-full gap-4"
        }`}
      >
        <div className={isGrid ? "mb-3" : "flex-1"}>
          <h3 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
            {title}
          </h3>
          <a
            href={url.startsWith('http') ? url : `https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1 mt-1"
          >
            {hostname}
            <ExternalLink className="h-3 w-3" />
          </a>
          {fileName && (
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
              <FileText className="h-4 w-4" />
              <span>{fileName}</span>
            </div>
          )}
          {category && (
            <div className="mt-2 text-sm text-gray-600">
              Category: {category}
            </div>
          )}
          {summary && (
            <div className="mt-2 text-sm text-gray-600">
              {summary}
            </div>
          )}
        </div>

        <div
          className={`flex items-center gap-4 text-sm text-gray-500 ${
            isGrid ? "mt-2" : ""
          }`}
        >
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <div className="flex gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs"
                >
                  {tag}
                </span>
              ))}
              {classification && (
                <span
                  className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-xs"
                >
                  {classification}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
