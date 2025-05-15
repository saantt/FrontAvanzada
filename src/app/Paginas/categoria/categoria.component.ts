import { Component, OnInit } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from '../../interfaces/categoria.interface';
import { CategoriaService } from '../../servicios/categoria.service';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  formularioCategoria!: FormGroup;
  categorias: Categoria[] = [];
  editando: boolean = false;
  idEditando: string = '';
  idCategoriaSeleccionada: string | null = null;  

  constructor(private fb: FormBuilder, private categoriaService: CategoriaService) {}

  ngOnInit() {
  this.formularioCategoria = this.fb.group({
    nombre: ['', Validators.required],
    icono: ['', Validators.required]
  });
  this.obtenerCategorias();
}

obtenerCategorias() {
  this.categoriaService.listarCategorias().subscribe(data => {
    this.categorias = data;
  });
}

guardarCategoria() {
  const categoria = this.formularioCategoria.value;
  console.log('Editando:', this.editando);
  console.log('ID seleccionado:', this.idCategoriaSeleccionada);
  console.log('Categoría:', categoria);

  if (this.editando && this.idCategoriaSeleccionada) {
    console.log('>> ACTUALIZANDO');
    this.categoriaService.actualizarCategoria(this.idCategoriaSeleccionada, categoria).subscribe(() => {
      this.resetFormulario();
    });
  } else {
    console.log('>> CREANDO');
    this.categoriaService.crearCategoria(categoria).subscribe(() => {
      this.resetFormulario();
    });
  }
}



editarCategoria(categoria: Categoria) {
  this.formularioCategoria.patchValue({
    nombre: categoria.nombre,
    icono: categoria.icono
  });
  this.editando = true;
  this.idCategoriaSeleccionada = categoria.id ?? null;
}

eliminarCategoria(id: string) {
  this.categoriaService.eliminarCategoria(id).subscribe(() => {
    this.resetFormulario();
  });
}

cancelarEdicion() {
  this.resetFormulario();
}

resetFormulario() {
  this.formularioCategoria.reset();
  this.editando = false;
  this.idCategoriaSeleccionada = null;
  this.obtenerCategorias();
}
}
