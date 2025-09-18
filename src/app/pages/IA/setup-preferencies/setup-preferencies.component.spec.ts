import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupPreferenciesComponent } from './setup-preferencies.component';

describe('SetupPreferenciesComponent', () => {
  let component: SetupPreferenciesComponent;
  let fixture: ComponentFixture<SetupPreferenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupPreferenciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupPreferenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
