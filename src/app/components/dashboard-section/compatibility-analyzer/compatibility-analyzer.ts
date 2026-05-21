import { Component, computed, inject, signal } from '@angular/core';
import { UserService } from '../../../services/user.service';

interface RolePreset {
  name: string;
  skills: string[];
}

@Component({
  selector: 'app-compatibility-analyzer',
  standalone: true,
  imports: [],
  templateUrl: './compatibility-analyzer.html'
})
export class CompatibilityAnalyzer {
  private userService = inject(UserService);
  user = this.userService.user;

  joshSkills = computed(() => {
    const all: string[] = [];
    this.user().skillCategories.forEach(cat => {
      cat.skills.forEach(s => all.push(s.name.toLowerCase()));
    });
    return all;
  });

  roles: RolePreset[] = [
    {
      name: 'Full Stack .NET ',
      skills: ['C#', '.NET', 'Blazor', 'Angular (v17-21)', 'TypeScript', 'TailwindCSS', 'MS SQL Server']
    },
    {
      name: 'Backend API Developer',
      skills: ['C#', '.NET', 'ASP.NET Core Web API', 'Entity Framework Core', 'MS SQL Server', 'Docker']
    },
    {
      name: 'Cloud & DevOps Integrator',
      skills: ['Microsoft Azure', 'Docker', 'Git & GitHub', 'CI/CD Pipelines', 'MS SQL Server']
    },
    {
      name: 'Frontend Developer',
      skills: ['Angular (v17-21)', 'Vue.js', 'TypeScript', 'TailwindCSS', 'Flutter', 'Dart', 'HTML5 & CSS3', 'Blazor']
    }
  ];

  availableSkills = [
    'C#', '.NET', 'ASP.NET Core Web API', 'Blazor', 'Entity Framework Core', 'SignalR',
    'Angular (v17-21)', 'Vue.js', 'React', 'Next.js', 'TypeScript', 'TailwindCSS', 'HTML5 & CSS3', 'JavaScript (ES6+)',
    'Flutter', 'Dart', 'React Native',
    'MS SQL Server', 'PostgreSQL', 'Redis', 'MongoDB', 'Oracle Database', 'MySQL',
    'Microsoft Azure', 'AWS', 'Google Cloud Platform', 'Docker', 'Kubernetes', 'Git & GitHub', 'CI/CD Pipelines', 'IIS Server', 'Terraform',
    'Java', 'Python', 'Go', 'Node.js'
  ];

  selectedSkills = signal<string[]>([]);
  selectedRole = signal<string | null>(null);
  isScanning = signal<boolean>(false);

  constructor() {
    this.selectRole(this.roles[0]);
  }

  toggleSkill(skill: string): void {
    this.selectedRole.set(null);
    this.triggerScan();

    this.selectedSkills.update(current => {
      if (current.includes(skill)) {
        return current.filter(s => s !== skill);
      } else {
        return [...current, skill];
      }
    });
  }

  selectRole(role: RolePreset): void {
    this.triggerScan();
    this.selectedRole.set(role.name);
    this.selectedSkills.set([...role.skills]);
  }

  clearAll(): void {
    this.selectedRole.set(null);
    this.selectedSkills.set([]);
  }

  private triggerScan(): void {
    this.isScanning.set(true);
    setTimeout(() => {
      this.isScanning.set(false);
    }, 450);
  }

  matchingSkills = computed(() => {
    return this.selectedSkills().filter(s => {
      const selectedLower = s.toLowerCase();
      return this.joshSkills().includes(selectedLower) || 
      (s.startsWith('Angular') && this.joshSkills().some(js => js.includes('angular'))) ||
      (selectedLower.includes('sql') && this.joshSkills().some(js => js.includes('sql'))) ||
      (selectedLower.includes('ci') && selectedLower.includes('cd') && this.joshSkills().some(js => js.includes('ci') && js.includes('cd')))
    });
  });

  missingSkills = computed(() => {
    return this.selectedSkills().filter(s => !this.matchingSkills().includes(s));
  });

  matchScore = computed(() => {
    const selected = this.selectedSkills().length;
    if (selected === 0) return 0;
    const matched = this.matchingSkills().length;
    return Math.round((matched / selected) * 100);
  });

  diagnosticText = computed(() => {
    const score = this.matchScore();
    const selected = this.selectedSkills().length;

    if (selected === 0) {
      return "Select target skills below or click a role preset to analyze Josh's technical compatibility instantly!";
    }

    if (score === 100) {
      return "Perfect fit! Josh has full proficiency in every single technology listed. Highly recommended for this technical configuration.";
    } else if (score >= 80) {
      return "Exceptional alignment! Josh matches almost all core requirements. His expertise in related enterprise patterns will allow him to bridge any minor gaps immediately.";
    } else if (score >= 50) {
      return "Strong foundational fit. Josh has excellent coverage of core architectural systems and frontend frameworks, ensuring rapid integration.";
    } else {
      return "Complementary skills overlap. Josh possesses strong core engineering principles in full-stack development, making him highly capable of cross-training.";
    }
  });
}
