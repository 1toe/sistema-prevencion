
import React from 'react';
import NavBar from './NavBar';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <main className="flex-1">
        <div className="health-container">
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-health-primary">{title}</h1>
              <div className="h-1 w-24 bg-health-accent mt-2"></div>
            </div>
          )}
          {children}
        </div>
      </main>
      <footer className="bg-muted py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Prevención Viña.</p>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
