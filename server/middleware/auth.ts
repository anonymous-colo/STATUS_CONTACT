import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      session: {
        adminLoggedIn?: boolean;
        save: (callback: (err: any) => void) => void;
        destroy: (callback: (err: any) => void) => void;
      };
    }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session?.adminLoggedIn) {
    return next();
  }
  
  res.status(401).json({ error: "Authentication required" });
}

export function adminLogin(req: Request, res: Response) {
  const { username, password, rememberMe } = req.body;

  if (username === "admin" && password === "kerventz2025") {
    req.session.adminLoggedIn = true;
    
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: "Session save failed" });
      }
      
      res.json({ 
        success: true, 
        message: "Login successful",
        rememberMe: !!rememberMe 
      });
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
}

export function adminLogout(req: Request, res: Response) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ success: true, message: "Logout successful" });
  });
}
