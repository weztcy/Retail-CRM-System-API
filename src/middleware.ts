import {
  NextRequest,
  NextResponse
} from "next/server";


import {
  verifyToken
} from "@/modules/auth/jwt.utils";



const corsHeaders = {

  "Access-Control-Allow-Origin":
    "http://localhost:3000",

  "Access-Control-Allow-Methods":
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",

  "Access-Control-Allow-Headers":
    "Content-Type, Authorization",

  "Access-Control-Allow-Credentials":
    "true",

};




export async function middleware(
  request: NextRequest
) {

console.log(
  "MIDDLEWARE:",
  request.method,
  request.nextUrl.pathname
);



  // Handle CORS preflight dulu
  if(
    request.method === "OPTIONS"
  ){

    return new NextResponse(
      null,
      {
        status:204,
        headers:corsHeaders
      }
    );

  }



  const pathname =
    request.nextUrl.pathname;



  // =========================
  // Protected API
  // =========================

  if(
    pathname.startsWith(
      "/api/protected"
    )
  ){


    const token =
      request.headers
      .get("authorization")
      ?.replace(
        "Bearer ",
        ""
      );



    if(!token){

      return NextResponse.json(

        {
          success:false,
          message:"Unauthorized"
        },

        {
          status:401,
          headers:corsHeaders
        }

      );

    }



    try{


      await verifyToken(token);



    }
    catch{


      return NextResponse.json(

        {
          success:false,
          message:"Invalid token"
        },

        {
          status:401,
          headers:corsHeaders
        }

      );


    }


  }



  const response =
    NextResponse.next();



  Object.entries(corsHeaders)
  .forEach(([key,value])=>{

    response.headers.set(
      key,
      value
    );

  });



  return response;


}




export const config = {

  matcher:[
    "/api/:path*"
  ]

};