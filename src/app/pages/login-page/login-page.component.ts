import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private route = inject(ActivatedRoute);

    loading = false;
    errorMsg = '';

    form: FormGroup = this.fb.group({
        restaurantName: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(4)]]
    });

    get f() { return this.form.controls; }

    async onSubmit(): Promise<void> {
        this.errorMsg = '';
        if (this.form.invalid || this.loading) {
            this.form.markAllAsTouched();
            return;
        }
        this.loading = true;

        try {
            const dto = this.form.value as { restaurantName: string; password: string };
            // Si querés usar returnUrl en el auth service, podés pasarlo por query param:
            const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
            await this.auth.login(dto);
            // auth.login ya navega a "/", si querés forzar returnUrl:
            // this.router.navigateByUrl(returnUrl);
        } catch (e: any) {
            this.errorMsg = e?.message || 'No se pudo iniciar sesión. Verificá tus datos.';
        } finally {
            this.loading = false;
        }
    }
}
