import { getMenuInfo } from "@/lib/menu";
import { PdfViewer } from "@/components/PdfViewer";

export default async function HomePage() {
  const menuInfo = await getMenuInfo();
  const version = menuInfo ? Math.floor(menuInfo.lastModified).toString() : "0";

  return <PdfViewer version={version} />;
}
