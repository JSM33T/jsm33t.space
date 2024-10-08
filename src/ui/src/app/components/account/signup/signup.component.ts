import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { ResponseHandlerService } from '../../../library/helpers/response-handler';
import { APIResponse } from '../../../library/interfaces/api-response.model';
import { Observable } from 'rxjs';


@Component({
	selector: 'app-signup',
	standalone: true,
	imports: [ReactiveFormsModule, RouterModule],
	templateUrl: './signup.component.html',
	styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
	isLoading: boolean = false;
	sigupForm!: FormGroup;

	constructor(
		private httpService: HttpService,
		private fb: FormBuilder,
		private router: Router,
		private responseHandler: ResponseHandlerService,
	) {
		this.sigupForm = this.fb.group({
			firstName: new FormControl(''),
			lastName: new FormControl(''),
			userName: new FormControl(''),
			email: new FormControl(''),
			password: new FormControl(''),
			confirmPassword: new FormControl(''),
		});
	}
    ngOnInit(): void {
    }

	onSubmit(): void {
		this.isLoading = true;
		console.log(this.sigupForm.value);
		const response$: Observable<APIResponse<any>> = this.httpService.post('api/account/signup', this.sigupForm.value);

		this.responseHandler.handleResponse(response$, true).subscribe({
			next: (response) => {
				console.log(response);
				this.isLoading = false;
				if (response.status == 200) {
					console.log(response.data.token);
					localStorage.setItem('token', response.data.token);
					//   this.router.navigate(['/account/otp']);
					this.router.navigate(['/account/otp'], {
						queryParams: { username: this.sigupForm.get('userName')?.value },
					});
				}
			},
			error: (error) => {
				console.log(error.error);
				this.isLoading = false;
			},
		});
	}

    togglePasswordVisibility(input: HTMLInputElement) {
		input.type = input.type === 'password' ? 'text' : 'password';
	}
}
