import { Injectable, signal } from '@angular/core';
import { UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly _user: UserProfile = {
    name: 'Josh J Piluden',
    title: 'Senior Application Developer',
    bio: 'I\'m a .NET dev who loves building things and nerding out over new tech—always learning and hacking away.',
    githubUrl: 'https://github.com/jjosh102',
    email: 'joshuajpiluden@gmail.com',
    avatarUrl: 'https://avatars.githubusercontent.com/u/50490077?v=4',
    socialLinks: [
      { name: 'GitHub', url: 'https://github.com/jjosh102', icon: 'github' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/josh-piluden-b06798110/', icon: 'linkedin' },
      { name: 'Email', url: 'mailto:joshuajpiluden@gmail.com', icon: 'email' }
    ],
    skillCategories: [
      {
        category: 'Backend & Core',
        skills: [
          { name: 'C#', icon: 'csharp' },
          { name: '.NET', icon: 'dotnet' },
          { name: 'ASP.NET Core Web API', icon: 'api' },
          { name: 'Entity Framework Core', icon: 'database' },
          { name: 'SignalR', icon: 'code' },
          { name: 'MS SQL Server', icon: 'database' },
          { name: 'PostgreSQL', icon: 'database' },
          { name: 'ASP Classic', icon: 'code' },
          { name: 'Cold Fusion', icon: 'code' },
          { name: 'PHP', icon: 'code' },
          { name: 'PERL', icon: 'code' }
        ]
      },
      {
        category: 'Frontend & UI',
        skills: [
          { name: 'Blazor', icon: 'blazor' },
          { name: 'Angular (v17-21)', icon: 'angular' },
          { name: 'Vue.js', icon: 'vue' },
          { name: 'TypeScript', icon: 'typescript' },
          { name: 'TailwindCSS', icon: 'tailwind' },
          { name: 'HTML5 & CSS3', icon: 'htmlcss' }
        ]
      },
      {
        category: 'Mobile Development',
        skills: [
          { name: 'Flutter', icon: 'flutter' },
          { name: 'Dart', icon: 'dart' }
        ]
      },
      {
        category: 'Cloud, DevOps & Systems',
        skills: [
          { name: 'Microsoft Azure', icon: 'azure' },
          { name: 'AWS', icon: 'aws' },
          { name: 'CI/CD Pipelines', icon: 'pipeline' },
          { name: 'Docker', icon: 'docker' },
          { name: 'Oracle SOA', icon: 'servers' },
          { name: 'Bash Scripting', icon: 'terminal' },
          { name: 'Git & GitHub', icon: 'git' }
        ]
      },
      {
        category: 'Power Platform & Automation',
        skills: [
          { name: 'Power Automate', icon: 'automation' },
          { name: 'PowerBI', icon: 'chart' },
          { name: 'SharePoint', icon: 'sharepoint' },
          { name: 'MS Access', icon: 'database' }
        ]
      }
    ],
    experiences: [
      {
        company: 'IBM',
        position: 'Senior Application Developer',
        period: 'Apr 2016 - Present',
        description: 'Created a Blazor web application to optimize video asset monitoring, incorporating real-time status dashboards, automated XML schema validation, and Excel data merging. This reduced processing time from 1 hour to 10 minutes and significantly improved team productivity and accuracy. Devised and executed a Power Automate solution, addressing a client’s $40,000 annual bot costs, cutting expenses to $1,560 and achieving a remarkable savings of $38,440. Orchestrated ServiceNow automated entry to eliminate manual ticket input, and introduced advanced PowerBI dashboards for strategic report decisions. Maintained and enhanced legacy applications (ASP Classic, Cold Fusion, Oracle SOA, PHP, and PERL).',
        technologies: ['Blazor', '.NET', 'C#', 'Power Automate', 'PowerBI', 'SQL', 'Oracle SOA', 'ASP Classic', 'Cold Fusion', 'PHP', 'PERL']
      },
      {
        company: 'Accenture',
        position: 'Senior Software Engineer',
        period: 'Apr 2012 - Mar 2016',
        description: 'Maintained and enhanced client’s HR applications, focusing on improving system performance and usability. Optimized SQL stored procedures, reducing Excel export times from 2 hours to 2 minutes, and converted MS Access tools into user-friendly ASP web applications. Managed and optimized the project SharePoint site to enhance data accessibility, usability, and facilitate seamless collaboration and information sharing.',
        technologies: ['SQL', 'ASP', 'MS Access', 'SharePoint', 'JavaScript', 'HTML/CSS']
      },
      {
        company: 'Texas Instruments',
        position: 'Application Developer',
        period: 'May 2011 - Mar 2012',
        description: 'Oversaw HR applications at TI Philippines by automating OT report generation, improving level 3 ticket resolution with a Windows Form tool, optimizing data management through bash scripts, and providing timely support for level 3 tickets.',
        technologies: ['C#', '.NET', 'WinForms', 'Bash Scripting', 'SQL']
      }
    ]
  };

  user = signal(this._user);
}
