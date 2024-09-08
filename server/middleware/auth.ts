import jwt from "jsonwebtoken";
import { EventHandlerRequest, H3Event } from "h3";

const IGNORE_PATHS = ["/api/login", "/login"];

function toLogin(event: H3Event<EventHandlerRequest>) {
  if (event.path.startsWith("/api")) {
    console.warn("[server middleware] Unauthorized");
    return new Response("Unauthorized", { status: 401 });
  }

  console.warn("[server middleware] Redirect to Login");
  return sendRedirect(event, "/login");
}

export default defineEventHandler(async (event) => {
  console.log("[server middleware]", event.path);
  if (event.path === "/logout") {
    setCookie(event, "auth", "", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 0,
    });

    event.context.auth = null;

    return sendRedirect(event, "/login");
  }

  if (IGNORE_PATHS.includes(event.path)) {
    return;
  }

  const cookie = getCookie(event, "auth");
  if (!cookie) {
    return toLogin(event);
  }

  try {
    const auth = jwt.verify(cookie, process.env.JWT_SECRET as string);
    if (!auth) {
      return toLogin(event);
    }
    event.context.auth = auth;
  } catch (error) {
    return toLogin(event);
  }
});
