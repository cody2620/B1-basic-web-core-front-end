import { STATE } from './state.js';
import { HTTP_ERROR_MESSAGES } from './errors.js';

const contactForm = document.querySelector('#contact-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');
const submitBtn = document.querySelector('#submit-btn');
const formLoading = document.querySelector('.form-loading');
const formSuccess = document.querySelector('.form-success');
const formError = document.querySelector('.form-error');
const errorReason = document.querySelector('.error-reason');
const retryBtn = document.querySelector('#retry-btn');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const formInputs = [nameInput, emailInput, messageInput];

const validateField = (input) => {
    const { id, value } = input;
    const trimmedValue = value.trim();
    let errorText = '';

    if (!trimmedValue) {
        errorText = '필수 입력 항목입니다.';
    } else if (id === 'email' && !EMAIL_REGEX.test(trimmedValue)) {
        errorText = '올바른 이메일 형식이 아닙니다.';
    }

    STATE.form.errors[id] = errorText;
    return errorText === '';
};

const renderFormErrors = () => {
    formInputs.forEach((input) => {
        const errorEl = input.nextElementSibling;
        const errorText = STATE.form.errors[input.id];
        errorEl.textContent = errorText || '';
    });
};

const renderFormStatus = () => {
    const status = STATE.form.status;
    const isSubmitting = status === 'loading';

    formLoading.hidden = status !== 'loading';
    formSuccess.hidden = status !== 'success';
    formError.hidden = status !== 'error';

    submitBtn.disabled = isSubmitting;
    formInputs.forEach(input => input.disabled = isSubmitting);
};

formInputs.forEach((input) => {
    input.addEventListener('input', () => {
        validateField(input);
        renderFormErrors();
    });
});

const submitForm = async (formData) => {
    const timeoutMs = 5000;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch('/api/contact', {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const status = response.status;
            const errorMessage = HTTP_ERROR_MESSAGES[status] || `서버 오류 (상태 코드: ${status})`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('요청 시간 초과 (5초). 인터넷 연결을 확인해주세요.');
        }
        if (error instanceof TypeError) {
            throw new Error('네트워크 오류: 인터넷 연결을 확인해주세요.');
        }
        throw error;
    }
};

contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const isAllValid = formInputs
        .map((input) => validateField(input))
        .every((valid) => valid);

    renderFormErrors();

    if (!isAllValid) {
        const firstInvalidField = formInputs.find((input) => STATE.form.errors[input.id]);
        if (firstInvalidField) {
            firstInvalidField.focus();
        }
        return;
    }

    STATE.form.status = 'loading';
    renderFormStatus();

    const formData = new FormData(contactForm);
    STATE.form.lastSubmitData = formData;

    try {
        await submitForm(formData);

        STATE.form.status = 'success';
        renderFormStatus();
        contactForm.reset();
        STATE.form.errors = { name: '', email: '', message: '' };
        renderFormErrors();

        setTimeout(() => {
            STATE.form.status = 'idle';
            renderFormStatus();
        }, 5000);

    } catch (error) {
        STATE.form.status = 'error';
        errorReason.textContent = error.message;
        renderFormStatus();
    }
});

retryBtn.addEventListener('click', () => {
    if (STATE.form.status === 'loading') return;
    if (STATE.form.lastSubmitData) {
        contactForm.dispatchEvent(new Event('submit'));
    }
});
