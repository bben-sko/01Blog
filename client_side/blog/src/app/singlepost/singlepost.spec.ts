import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Singlepost } from './singlepost';

describe('Singlepost', () => {
  let component: Singlepost;
  let fixture: ComponentFixture<Singlepost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Singlepost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Singlepost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
