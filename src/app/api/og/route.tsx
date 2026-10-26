import { NextRequest } from "next/server";
import { siteConfig } from "@/config/site";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const title = searchParams.get("title");

    if (!title) {
      return new Response("No title provider", { status: 500 });
    }

    const heading =
      title.length > 148 ? `${title.substring(0, 140)}...` : title;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url;
    const fontData = await fetch(
      `${appUrl}/fonts/RethinkSans-ExtraBold.ttf`
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          tw="flex relative flex-col p-44 w-full h-full items-start text-white "
          style={{
            backgroundImage: `url(${appUrl}/background.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            fontFamily: "Rethink Sans",
          }}
        >
          <div tw="flex flex-col flex-1 py-12 mt-28">
            <div tw="flex text-[120px] font-semibold leading-[120px]">
              {heading}
            </div>
          </div>
          <div tw="flex items-center w-full justify-between ">
            <div tw="flex text-3xl">{siteConfig.url}</div>
          </div>
        </div>
      ),
      {
        width: 1920,
        height: 1080,
        fonts: [
          {
            name: "Rethink Sans",
            data: fontData,
            style: "normal",
            weight: 800,
          },
        ],
      }
    );
  } catch (error) {
    console.error("Failed to generate image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
