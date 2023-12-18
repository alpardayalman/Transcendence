from django.shortcuts import render
from django.views.generic import ListView
from django.views.generic.edit import CreateView, DeleteView, UpdateView
from .models import Owner, Patient
from .forms import OwnerCreateForm, PatientCreateForm
from django.urls import reverse_lazy

def home(request):
   context = {"name": "Djangoer"}
   return render(request, 'beta_app/home.html', context)

class OwnerList(ListView):
   model = Owner
   template_name = 'beta_app/owner_list.html'

class OwnerCreate(CreateView):
   model = Owner
   template_name = 'beta_app/owner_create_form.html'
   form_class = OwnerCreateForm
   success_url = reverse_lazy('ownerlist')

class OwnerUpdate(UpdateView):
   model = Owner
   template_name = 'beta_app/owner_update.html'
   form_class = OwnerCreateForm
   success_url = reverse_lazy('ownerlist')
   
class OwnerDelete(DeleteView):
   model = Owner
   template_name = 'beta_app/owner_delete.html'
   success_url = reverse_lazy('ownerlist')



class PatientList(ListView):
   model = Patient
   template_name = "beta_app/patient_list.html"
   # context_object_name = 'pet_list'  # This sets the name of the variable in the template

   # def get_queryset(self):
   #    # This method defines the queryset for the view
   #    return Patient.objects.all() // hay amk

class PatientCreate(CreateView):
   model = Patient
   template_name = "beta_app/patient_create_form.html"
   form_class = PatientCreateForm
   success_url = reverse_lazy('patientlist')

class PatientUpdate(UpdateView):
   model = Patient
   template_name = "beta_app/patient_update.html"
   form_class = PatientCreateForm
   success_url = reverse_lazy('patientlist')

class PatientDelete(DeleteView):
   model = Patient
   template_name = 'beta_app/patient_delete.html'
   success_url = reverse_lazy('patientlist')