import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectSpotlight } from './project-spotlight';
import { GithubRepo } from '../../../models/github.model';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('ProjectSpotlight', () => {
  let component: ProjectSpotlight;
  let fixture: ComponentFixture<ProjectSpotlight>;

  const mockRepo: GithubRepo = {
    id: 123,
    name: 'Test Project',
    description: 'A test description for the spotlight.',
    language: 'TypeScript',
    stargazers_count: 10,
    forks_count: 5,
    updated_at: new Date().toISOString(),
    html_url: 'https://github.com/test/project',
    topics: ['angular', 'test'],

  } as GithubRepo;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSpotlight],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectSpotlight);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('repo', mockRepo);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the repo name', () => {
    fixture.componentRef.setInput('repo', mockRepo);
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(titleElement.textContent).toContain(mockRepo.name);
  });

  it('should display the repo description', () => {
    fixture.componentRef.setInput('repo', mockRepo);
    fixture.detectChanges();
    const descElement = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(descElement.textContent).toContain(mockRepo.description);
  });

  it('should display the primary language', () => {
    fixture.componentRef.setInput('repo', mockRepo);
    fixture.detectChanges();
    const langElement = fixture.debugElement.query(By.css('footer span.font-black')).nativeElement;
    expect(langElement.textContent).toContain(mockRepo.language);
  });

  it('should display star count if greater than 0', () => {
    fixture.componentRef.setInput('repo', mockRepo);
    fixture.detectChanges();
    const starsElement = fixture.debugElement.query(By.css('.text-yellow-500')).parent?.nativeElement;
    expect(starsElement.textContent).toContain(mockRepo.stargazers_count.toString());
  });

  it('should not display stars if count is 0', () => {
    const zeroStarsRepo = { ...mockRepo, stargazers_count: 0 };
    fixture.componentRef.setInput('repo', zeroStarsRepo);
    fixture.detectChanges();
    const starsElement = fixture.debugElement.query(By.css('.text-yellow-500'));
    expect(starsElement).toBeNull();
  });
});
