/**
 * Renders a list of application tips for student dormitory applications, including
 * visual icons, priority badges, and descriptions for each tip. Also provides a section
 * with additional resources for further information.
 *
 * @component
 *
 * @remarks
 * - Uses UI components such as `Card`, `Badge`, and Lucide icons for visual presentation.
 * - Tips are displayed in a responsive grid layout.
 * - Each tip includes an icon, title, description, and a priority badge with contextual color.
 * - The "Ek Kaynaklar" section lists useful external resources for students.
 */
/**
 * ApplicationTips Component
 *  
 * This component displays a series of tips for students applying for dormitories,
 * including icons, titles, descriptions, and priority badges.
 * 
 * @param {Object} props - The component props.
 * @returns {JSX.Element} The rendered component.
 *
 **/
/**
 * const getPriorityColor = (priority: string): string => { ... }
 * Returns the CSS classes for the badge color based on the tip's priority.
 *
 * @param priority - The priority level of the tip ("high", "medium", or other).
 * @returns A string of Tailwind CSS classes for badge styling.
 **/
/**
 * const getPriorityText = (priority: string): string => { ... }
 * Returns the display text for the tip's priority.
 *
 * @param priority - The priority level of the tip ("high", "medium", or other).
 * @returns A string representing the priority in Turkish.
 */

"use client";



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Mail, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  Calendar,
  Euro
} from "lucide-react";

export function ApplicationTips() {
  const tips = [
    {
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      title: "Erken Başvuru",
      description: "Yurt başvurularını mümkün olduğunca erken yapın. Popüler yurtlarda bekleme süreleri çok uzun olabilir.",
      priority: "high"
    },
    {
      icon: <Mail className="w-5 h-5 text-green-600" />,
      title: "E-posta Takibi",
      description: "Başvuru sonrası düzenli olarak e-postalarınızı kontrol edin ve gerekli belgeleri zamanında gönderin.",
      priority: "medium"
    },
    {
      icon: <FileText className="w-5 h-5 text-purple-600" />,
      title: "Belgeler",
      description: "Öğrenci belgesi, gelir belgesi ve Bafög onayı gibi gerekli belgeleri önceden hazırlayın.",
      priority: "high"
    },
    {
      icon: <Euro className="w-5 h-5 text-orange-600" />,
      title: "Bütçe Planlaması",
      description: "Kira dışında kauçon, internet ve diğer ek masrafları da hesaba katın.",
      priority: "medium"
    },
    {
      icon: <Clock className="w-5 h-5 text-red-600" />,
      title: "Alternatif Planlar",
      description: "Birden fazla yurda başvuru yapın ve WG arama sitelerini de kontrol edin.",
      priority: "high"
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-teal-600" />,
      title: "Başvuru Takibi",
      description: "Başvuru durumlarınızı takip edin ve gerektiğinde yurt yönetimi ile iletişime geçin.",
      priority: "medium"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Yüksek Öncelik";
      case "medium":
        return "Orta Öncelik";
      default:
        return "Düşük Öncelik";
    }
  };

  return (
    <div className="mt-12 bg-white rounded-lg border shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Lightbulb className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Başvuru İpuçları</h2>
            <p className="text-gray-600">Yurt başvurunuzda başarılı olmanız için öneriler</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tips.map((tip, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {tip.icon}
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {tip.title}
                    </CardTitle>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getPriorityColor(tip.priority)}`}
                  >
                    {getPriorityText(tip.priority)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {tip.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Ek Kaynaklar</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Studentenwerk München:</strong> Resmi öğrenci yurt başvuru merkezi</li>
                <li>• <strong>WG-Gesucht.de:</strong> WG ve özel daire arama platformu</li>
                <li>• <strong>Studenten-WG.de:</strong> Öğrenci WG arama sitesi</li>
                <li>• <strong>Turkish Club München:</strong> Türk öğrencilerin deneyimlerini paylaştığı topluluk</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
