import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modelos3dComponent } from './modelos3d.component';

describe('Modelos3dComponent', () => {
  let component: Modelos3dComponent;
  let fixture: ComponentFixture<Modelos3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modelos3dComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Modelos3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
