import React from "react"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { saveAs} from 'file-saver'

interface ImagePreviewProps {
  imageUrl: string
  onClose: () => void
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, onClose }) => {
  const handleDownload = () => {
    const fileName = 'image.png'
    saveAs(imageUrl, fileName)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative max-w-4xl max-h-[90vh] w-full rounded-xl p-4 flex flex-col items-end">
        {/* Top Right Buttons */}
        <div className="flex space-x-2 mb-4"> {/* Add margin bottom here */}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDownload}
            className="text-foreground hover:bg-muted rounded-full"
          >
            <Download className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="text-foreground hover:bg-muted rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Image */}
        <img
          src={imageUrl}
          alt="Preview"
          className="max-w-full max-h-[80vh] rounded-md object-contain"
        />
      </div>
    </div>
  )
}

export default ImagePreview
