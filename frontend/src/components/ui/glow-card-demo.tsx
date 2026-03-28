import { Card, CardCanvas } from "@/components/ui/animated-glow-card";
import { XCard } from "@/components/ui/x-gradient-card"

const XCardDummyData = {
    authorName: "EaseMise",
    authorHandle: "easemize",
    authorImage: "https://pbs.twimg.com/profile_images/1854916060807675904/KtBJsyWr_400x400.jpg",
    content: [
        "The Outer container with border and dots its the actual Card",
        "Wrap it around anything to have a cool card like this",
    ],
    isVerified: true,
    timestamp: "Today",
    reply: {
        authorName: "GoodGuy",
        authorHandle: "gdguy",
        authorImage:
            "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
        content: "Its Easy to Use great to customize",
        isVerified: true,
        timestamp: "10 mintes ago",
    },
};

function XCardDemoDefault() {
    return <XCard {...XCardDummyData} />
}

const GlowCardDemo = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center bg-black">
      <CardCanvas>
        <Card className="w-auto p-6">
          <div className="dark">
            <XCard {...XCardDummyData} />
          </div>
        </Card>
      </CardCanvas>
    </div>
  );
};

export default GlowCardDemo;
