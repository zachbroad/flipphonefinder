import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Compare Flip Phones | Side-by-Side Dumbphone Comparison Tool",
  description: "Compare flip phones side-by-side. Compare features, prices, battery life, and specifications of dumbphones to find your perfect digital wellness device.",
  keywords: "flip phone comparison, dumbphone compare, feature phone comparison tool, basic phone specs, compare minimalist phones",
  openGraph: {
    title: "Compare Flip Phones | Side-by-Side Dumbphone Comparison Tool",
    description: "Compare flip phones side-by-side. Compare features, prices, battery life, and specifications of dumbphones to find your perfect digital wellness device.",
    url: "https://flipphonefinder.com/compare",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Flip Phones | Side-by-Side Dumbphone Comparison Tool",
    description: "Compare flip phones side-by-side. Compare features, prices, battery life, and specifications of dumbphones to find your perfect digital wellness device.",
  },
  alternates: {
    canonical: "https://flipphonefinder.com/compare",
  },
}

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}