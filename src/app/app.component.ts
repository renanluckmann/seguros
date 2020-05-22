import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MASKS, NgBrazilValidators } from 'ng-brazil';
import {MatSnackBar} from '@angular/material/snack-bar';


export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Seguros';
  MASKS = MASKS;
  checkoutForm;
  desejadas;

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {
    this.checkoutForm = new FormGroup({
      nomeCompleto: new FormControl('', [
        Validators.required,
      ]),
      dtNascimento: new FormControl('', [
        Validators.required,
      ]),
      sexo: new FormControl('', [
        Validators.required,
      ]),
      profissao: new FormControl('', [
        Validators.required,
      ]),
      cidade: new FormControl('', [
        Validators.required,
      ]),
      bairro: new FormControl('', [
        Validators.required,
      ]),
      endereco: new FormControl('', [
        Validators.required,
      ]),
      CEP: new FormControl('', [
        Validators.required,
      ]),
      telefone: new FormControl(),
      celular: new FormControl('', [
        Validators.required,
      ]),
      email: new FormControl('', [
        Validators.required,
      ]),
      fumante: new FormControl('', [
        Validators.required,
      ]),
      esportesRadicais: new FormControl('', [
        Validators.required,
      ]),
      quaisEsportes: new FormControl(),
      participantes: new FormControl('', [
        Validators.required,
      ]),
      valores: new FormArray([
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl(),
      ])
    });
  }

  task: Task = {
    name: 'Todos',
    completed: false,
    color: 'primary',
    subtasks: [
      { name: 'Morte Natural', completed: false, color: 'primary' },
      { name: 'Morte por Acidente', completed: false, color: 'primary' },
      { name: 'Invalidez Permanente', completed: false, color: 'primary' },
      { name: 'Invalidez Perm. Total ou Parcial por Acidente', completed: false, color: 'primary' },
      { name: 'Invalidez Permanente Total por Doença', completed: false, color: 'primary' },
      { name: 'Despesas Médico-Hospitalares por Acidente', completed: false, color: 'primary' },
      { name: 'Doenças Graves', completed: false, color: 'primary' },
      { name: 'Assistência Funeral', completed: false, color: 'primary' },
    ]
  };

  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  abrir(subtask) {
    console.log(subtask.completed);

  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => t.completed = completed);
  }

  onSubmit(form1) {
    this.desejadas = [];
    this.task.subtasks.filter(t => t.completed).forEach(t => this.desejadas.push(t.name));
    form1.valores = form1.valores.filter(item => item != null && item != 0)
    for (let index = 0; index < this.desejadas.length; index++) {
      this.desejadas[index] += " : R$ " + form1.valores[index] + ` 

                -`;
    }
    let email = `Cadastro Orçamento Seguro de Vida 
    
                   Nome:        #NOME
                   Nascimento:  #NASCIMENTO
                   Sexo:        #SEXO
                   Profissão:   #PROFISSAO
                   Cidade:      #CIDADE
                   Bairro:      #BAIRRO
                   Endereco:    #ENDERECO
                   CEP:         #CEP
                   Telefone:    #TELEFONE
                   Celular:     #CELULAR
                   Email:       #EMAIL
                   Fumante?:    #FUMANTE
                   Esportes Radicais: #ESPORTES
                   Quais esportes?:   #QUAIS

                   Participantes:     #PARTICIPANTES
                   
                   Coberturas/Valores:
                   #COBERTURAS
                   `;
    email = email.replace("#NOME", form1.nomeCompleto)
      .replace("#NASCIMENTO", form1.dtNascimento)
      .replace("#SEXO", form1.sexo)
      .replace("#PROFISSAO", form1.profissao)
      .replace("#CIDADE", form1.cidade)
      .replace("#BAIRRO", form1.bairro)
      .replace("#ENDERECO", form1.endereco)
      .replace("#CEP", form1.CEP)
      .replace("#TELEFONE", form1.telefone)
      .replace("#CELULAR", form1.celular)
      .replace("#EMAIL", form1.email)
      .replace("#FUMANTE", form1.fumante)
      .replace("#ESPORTES", form1.esportesRadicais)
      .replace("#QUAIS", form1.quaisEsportes)
      .replace("#PARTICIPANTES", form1.participantes)
      .replace("#COBERTURAS", this.desejadas)
      .replace("null", "");

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post('https://formspree.io/moqkjyvo',
      { name: 'Seguradora', replyto: 'rluckmann94@gmail.com', message: email },
      { 'headers': headers }).subscribe(
        response => {
          console.log(response);
        }
      );
      
    this._snackBar.open("Enviado com sucesso! Obrigado," + form1.nomeCompleto + ".", "", {
      duration: 2000,
    });
    this.checkoutForm.reset();
    Object.keys(this.checkoutForm.controls).forEach(
      field => {
        this.checkoutForm.get(field).setErrors(null);
      }
    );
  }
}
