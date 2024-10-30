import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ConfirmeTaskService } from './confirme-task.service';
import { TaskService } from 'src/app/services/task.service';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-confirme-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardComponent,
    SharedModule,
    HttpClientModule,
  ],
  providers: [ConfirmeTaskService,TaskService],  // Provide the service here
  templateUrl: './confirme-task.component.html',
  styleUrl: './confirme-task.component.scss'
})
export class ConfirmeTaskComponent implements OnInit {
  quizForm: FormGroup;
  taskId: string | null;
  task: any;
  quiz: any;
  loading = true;
  inputQuiz = false;
  formErrors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private confirmeTaskService: ConfirmeTaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTask();
  }

  initForm(): void {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      questions: this.fb.array([]),
      password: ['', Validators.required]
    });
  }

  loadTask(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe((task) => {
        if (!task) {
          this.router.navigate(['/task']);
        } else {
          this.task = task;
          this.inputQuiz = this.task.taskType === 'quiz';
          if (this.inputQuiz && this.task.quizId) {
            this.loadQuiz(this.task.quizId);
          } else {
            this.loading = false;
          }
          this.updateFormValidators();
        }
      });
    } else {
      this.router.navigate(['/task']);
    }
  }

  loadQuiz(quizId: string): void {
    this.confirmeTaskService.getQuizById(quizId).subscribe((quiz) => {
      this.quiz = quiz;
      this.populateForm();
      this.loading = false;
    });
  }

  populateForm(): void {
    if (this.quiz) {
      this.quizForm.patchValue({
        title: this.quiz.title
      });
      this.quiz.questions.forEach((question: any) => {
        const questionGroup = this.fb.group({
          questionText: [question.questionText, Validators.required],
          answers: this.fb.array([], this.minAnswersValidator(2))
        });
        question.answers.forEach((answer: any) => {
          (questionGroup.get('answers') as FormArray).push(this.fb.control(answer.text, Validators.required));
        });
        this.questions.push(questionGroup);
      });
    }
  }

  updateFormValidators(): void {
    if (this.inputQuiz) {
      this.quizForm.get('title')?.setValidators(Validators.required);
      this.questions.setValidators(this.minQuestionsValidator(1));
    } else {
      this.quizForm.get('title')?.clearValidators();
      this.questions.clearValidators();
    }
    this.quizForm.get('title')?.updateValueAndValidity();
    this.questions.updateValueAndValidity();
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  addQuestion() {
    const question = this.fb.group({
      questionText: ['', Validators.required],
      answers: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ], this.minAnswersValidator(2))
    });
    this.questions.push(question);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  getAnswers(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('answers') as FormArray;
  }

  addAnswer(questionIndex: number) {
    this.getAnswers(questionIndex).push(this.fb.control('', Validators.required));
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    this.getAnswers(questionIndex).removeAt(answerIndex);
  }

  submitQuiz() {
    this.formErrors = this.validateForm();
    if (this.formErrors.length === 0) {
      const quizData = this.prepareQuizData();
      if (!this.inputQuiz) {
        this.confirmeTaskService.confirmeTask(this.taskId, this.quizForm.value.password).subscribe( 
        response => {
          console.log('Task Confiermed updated successfully');
          // Handle success (e.g., show a success message, navigate to a different page)
        },
        error => {
          console.error('Error updating quiz:', error);
          this.formErrors.push('Failed to update quiz. Please try again.');
        })
      }
      else if (this.quiz) {
        this.updateQuiz(quizData);
      } else {
        this.createQuiz(quizData);
      }
    }
  }

  prepareQuizData(): any {
    const formValue = this.quizForm.value;
    return {
      title: formValue.title,
      questions: formValue.questions.map((q: any) => ({
        questionText: q.questionText,
        answers: q.answers.map((a: string) => ({ text: a }))
      }))
    };
  }

  updateQuiz(quizData: any): void {
    this.confirmeTaskService.updateQuiz(this.task.quizId, quizData, this.quizForm.value.password).subscribe(
      response => {
        console.log('Quiz updated successfully');
        // Handle success (e.g., show a success message, navigate to a different page)
      },
      error => {
        console.error('Error updating quiz:', error);
        this.formErrors.push('Failed to update quiz. Please try again.');
      }
    );
  }

  createQuiz(quizData: any): void {
    this.confirmeTaskService.createQuiz(quizData, this.task._id, this.quizForm.value.password).subscribe(
      response => {
        console.log('Quiz created successfully');
        // Handle success (e.g., show a success message, navigate to a different page)
      },
      error => {
        console.error('Error creating quiz:', error);
        this.formErrors.push('Failed to create quiz. Please try again.');
      }
    );
  }

  validateForm(): string[] {
    const errors: string[] = [];
    
    if (this.inputQuiz) {
      if (this.quizForm.get('title')?.invalid) {
        errors.push('Quiz title is required.');
      }
      if (this.questions.invalid) {
        errors.push('At least one question is required for the quiz.');
      }
      this.questions.controls.forEach((question, index) => {
        if (question.get('questionText')?.invalid) {
          errors.push(`Question ${index + 1} text is required.`);
        }
        const answers = question.get('answers') as FormArray;
        if (answers.invalid) {
          errors.push(`Question ${index + 1} must have at least 2 answers.`);
        }
      });
    }

    if (this.quizForm.get('password')?.invalid) {
      errors.push('Password is required.');
    }

    return errors;
  }

  minQuestionsValidator(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormArray) {
        return control.length >= min ? null : { minQuestions: { required: min, actual: control.length } };
      }
      return null;
    };
  }

  minAnswersValidator(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormArray) {
        return control.length >= min ? null : { minAnswers: { required: min, actual: control.length } };
      }
      return null;
    };
  }
}