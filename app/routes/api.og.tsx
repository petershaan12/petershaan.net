import { json } from "@remix-run/node";  
import type { LoaderFunctionArgs } from "@remix-run/node";
import { ImageResponse } from "@vercel/og";  
import { siteConfig } from "~/config/site";  
import fs from "fs";    
import path from "path";  

export const loader = async ({ request }: LoaderFunctionArgs) => {  
  const url = new URL(request.url);  
  const title = url.searchParams.get("title");  
  
  if (!title) {  
    return json({ error: "No title provided" }, { status: 500 });  
  }  
  
  const heading = title.length > 148 ? `${title.substring(0, 140)}...` : title;  
  
  const interBoldPath = path.resolve("assets/fonts/Inter-Bold.ttf"); 
  const fontBold = fs.readFileSync(interBoldPath);  
  
  return new ImageResponse(  
    (  
      <div  
        style={{  
          display: "flex",  
          position: "relative",  
          flexDirection: "column",  
          padding: "11rem",  
          width: "100%",  
          height: "100%",  
          alignItems: "flex-start",  
          color: "white",  
          backgroundImage: `url(${process.env.REMIX_PUBLIC_APP_URL}/background.png)`,  
          backgroundSize: "cover",  
          backgroundPosition: "center",  
        }}  
      >  
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingTop: "3rem", marginTop: "7rem" }}>  
          <div style={{ display: "flex", fontSize: "120px", fontWeight: "bold", lineHeight: "120px", letterSpacing: "-0.025em" }}>  
            {heading}  
          </div>  
        </div>  
        <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>  
          <div style={{ display: "flex", fontSize: "1.5rem" }}>{siteConfig.url}</div>  
        </div>  
      </div>  
    ),  
    {  
      width: 1920,  
      height: 1080,  
      fonts: [  
        {  
          name: "Inter",  
          data: fontBold,  
          style: "normal",  
          weight: 700,  
        },  
      ],  
    }  
  );  
};  
  

