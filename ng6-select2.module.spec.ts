import { Ng6Select2Module } from './ng6-select2.module';

describe('Ng6Select2Module', () => {
  let ng6Select2Module: Ng6Select2Module;

  beforeEach(() => {
    ng6Select2Module = new Ng6Select2Module();
  });

  it('should create an instance', () => {
    expect(ng6Select2Module).toBeTruthy();
  });
});
