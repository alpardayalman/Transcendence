from django.shortcuts import render
from .forms import YourModelForm
from django.http import JsonResponse

# Create your views here.
def spa_main(request):
    return render(request, 'S_A_P/spa_main.html')

def spa_page(request):
    return render(request, 'S_A_P/spa_page.html')

def form_submission(request):
    if request.method == 'POST':
        form = YourModelForm(request.POST)
        if form.is_valid():
            form.save()
            # Optionally, you can redirect the user to another page after form submission
            return JsonResponse({'success': True})
    else:
        form = YourModelForm()

    return render(request, 'S_A_P/form_submission.html', {'form': form})
