import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardComponent,
    SharedModule,
    HttpClientModule
  ],
  providers: [TaskService]  // Provide the service here

})
export class TaskComponent {
  taskForm: FormGroup;
  eligibleUsers: number | undefined;
  totalPrice: number | undefined;
  isModalOpen = false;  // Boolean to control modal visibility
  nbrUser = 0;
  amount = 0;
  toEdit = false;
  tagInput = new FormControl('');
  filteredTags: string[] = [];
  selectedTags: string[] = [];
  selectedZone: string | null = null;
  subRegions: string[] = [];
  zones = {
    "Ariana": ["Ariana Ville", "Ettadhamen", "Mnihla", "Raoued", "Sidi Thabet", "Soukra"],
    "Béja": ["Amdoun", "Beja North", "Beja South", "Goubellat", "Medjez El Bab", "Nefza", "Téboursouk", "Testour"],
    "Ben Arous": ["Ben Arous", "Bou Mhel el-Bassatine", "El Mourouj", "Ezzahra", "Fouchana", "Hammam Chott", "Hammam Lif", "Mornag", "Mohamed Ali", "Radès"],
    "Bizerte": ["Bizerte North", "Bizerte South", "El Alia", "Ghar El Melh", "Ghezala", "Joumine", "Mateur", "Menzel Bourguiba", "Menzel Jemil", "Ras Jebel", "Sejnane", "Tinja", "Utique"],
    "Gabès": ["El Hamma", "Gabès Medina", "Gabès West", "Gabès South", "Ghannouch", "Mareth", "Matmata", "Menzel El Habib", "Nouvelle Matmata"],
    "Gafsa": ["Belkhir", "El Guettar", "El Ksar", "Gafsa North", "Gafsa South", "Mdhilla", "Moularès", "Redeyef", "Sidi Aich", "Sned", "Metlaoui"],
    "Jendouba": ["Ain Draham", "Balta Bou Aouane", "Bou Salem", "Fernana", "Ghardimaou", "Jendouba North", "Jendouba South", "Oued Mliz", "Tabarka"],
    "Kairouan": ["Al Ala", "Bou Hajla", "Chebika", "Haffouz", "Hajeb El Ayoun", "Kairouan North", "Kairouan South", "Nasrallah", "Oueslatia", "Sbikha"],
    "Kasserine": ["Ayoun", "Ezzouhour", "Feriana", "Foussana", "Haïdra", "Hassi El Ferid", "Jedelienne", "Kasserine North", "Kasserine South", "Majel Bel Abbès", "Sbeitla", "Sbiba", "Thala"],
    "Kébili": ["Douz North", "Douz South", "Faouar", "Kebili North", "Kebili South", "Souk Lahad"],
    "Kef": ["Dahmani", "El Ksour", "Jerissa", "Kalaat Khasba", "Kalaat Senan", "Kef East", "Kef West", "Nebeur", "Sakiet Sidi Youssef", "Sers", "Tajerouine"],
    "Mahdia": ["Bou Merdes", "Chebba", "Chorbane", "El Jem", "Hbira", "Ksour Essef", "Mahdia", "Melloulèche", "Ouled Chamekh", "Sidi Alouane", "Souassi"],
    "Manouba": ["Borj El Amri", "Douar Hicher", "El Battan", "Jedaida", "Manouba", "Mornaguia", "Oued Ellil", "Tebourba"],
    "Medenine": ["Ben Guerdane", "Beni Khedache", "Djerba - Ajim", "Djerba - Houmet Souk", "Djerba - Midoun", "Medenine North", "Medenine South", "Sidi Makhlouf", "Zarzis"],
    "Monastir": ["Bekalta", "Bembla", "Beni Hassen", "Jemmal", "Ksibet el Mediouni", "Ksar Hellal", "Lamta", "Moknine", "Monastir", "Menzel Ennour", "Menzel Fersi", "Sahline", "Sayada-Lamta-Bou Hjar", "Teboulba", "Zeramdine"],
    "Nabeul": ["Beni Khalled", "Beni Khiar", "Bou Argoub", "Dar Chaabane", "El Haouaria", "Grombalia", "Hammamet", "Kélibia", "Korba", "Menzel Bouzelfa", "Menzel Temime", "Nabeul", "Soliman", "Takelsa"],
    "Sfax": ["Agareb", "Bir Ali Ben Khalifa", "El Amra", "El Hencha", "Graiba", "Jebeniana", "Kerkennah", "Mahres", "Menzel Chaker", "Sakiet Eddaier", "Sakiet Ezzit", "Sfax Medina", "Sfax West", "Sfax South", "Skhira", "Thyna"],
    "Sidi Bouzid": ["Bir El Hafey", "Cebbala Ouled Asker", "Jelma", "Mazzouna", "Meknassy", "Menzel Bouzaiane", "Ouled Haffouz", "Regueb", "Sidi Ali Ben Aoun", "Sidi Bouzid East", "Sidi Bouzid West", "Souk Jedid"],
    "Siliana": ["Bargou", "Bouarada", "El Aroussa", "Gaafour", "Kesra", "Makthar", "Rouhia", "Siliana North", "Siliana South"],
    "Sousse": ["Akouda", "Bouficha", "Enfidha", "Hammam Sousse", "Hergla", "Kondar", "Msaken", "Sidi Bou Ali", "Sidi El Hani", "Sousse Jawhara", "Sousse Medina", "Sousse Riadh", "Sousse Sidi Abdelhamid"],
    "Tataouine": ["Bir Lahmar", "Dehiba", "Ghomrassen", "Remada", "Tataouine North", "Tataouine South"],
    "Tozeur": ["Degache", "Hazoua", "Nefta", "Tameghza", "Tozeur"],
    "Tunis": ["Bab Bhar", "Bab Souika", "Carthage", "Cité El Khadra", "Djebel Jelloud", "El Kabaria", "El Menzah", "El Omrane", "El Omrane supérieur", "El Ouardia", "Ettahrir", "Ezzouhour", "Hrairia", "La Goulette", "La Marsa", "Le Bardo", "Le Kram", "Medina", "Sidi El Béchir", "Sidi Hassine"],
    "Zaghouan": ["Bir Mcherga", "El Fahs", "Nadhour", "Saouaf", "Zaghouan", "Zriba"]
  };

  date = new Date().getTime();
  tasks: any = [];
  expandedZones: { [key: string]: boolean } = {};

  task = {
    taskName: '',
    zone: '',
    subRegions: '',
    description: '',
    numberOfEligibleUsers: '',
    price: '',
    taskType: '',
    target: {
      All: false,
      Men: false,
      Women: false,
      Under: false,
      Over: false
    },
    startDate: null as Date | null,
    endDate: null as Date | null
  };
  photo: any;
  updateStep: boolean = false;
  idUpdate: any;
  selectedZones: string[] = [];
  selectedRegions: string[] = [];
  allTags = [];

  constructor(private TaskService: TaskService , private router: Router,private fb: FormBuilder, private taskService: TaskService) {
    this.fetchTask();
    this.taskForm = this.fb.group({
      taskName: ['', Validators.required],
      taskType: ['', Validators.required],
      description: [''],
      sex: [''],
      ageRange: this.fb.group({
        min: [''],
        max: ['']
      }),
      zones: [[]],  // New form control for multiple zones
      regions: [[]],  // New form control for multiple regions
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      tags: [[]],
    });

    this.taskForm.get('zone')?.valueChanges.subscribe((zone) => {
      this.selectedZone = zone;
      this.subRegions = this.zones[zone] || [];
      this.taskForm.get('subRegion')?.reset(); // Reset sub-region on zone change
    });

    this.tagInput.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.TaskService.searchTags(this.allTags, value || ''))
    ).subscribe(tags => {
      this.filteredTags = tags;
    });
    this.TaskService.getAllTags().subscribe((taags)=> {
      this.allTags = taags;
      console.log(taags)
      this.filteredTags = taags;
    });

    // Initialize expandedZones
    Object.keys(this.zones).forEach(zone => {
      this.expandedZones[zone] = false;
    });

  }

  toggleZone(zone: string): void {
    const index = this.selectedZones.indexOf(zone);
    if (index === -1) {
      // Add zone
      this.selectedZones.push(zone);
    } else {
      // Remove zone and its regions
      this.selectedZones.splice(index, 1);
      this.selectedRegions = this.selectedRegions.filter(
        region => !this.zones[zone].includes(region)
      );
    }
    this.calculatePrice();
  }

  toggleRegion(zone: string, region: string): void {
    if (!this.selectedZones.includes(zone)) return;

    const index = this.selectedRegions.indexOf(region);
    if (index === -1) {
      this.selectedRegions.push(region);
    } else {
      this.selectedRegions.splice(index, 1);
    }
    this.calculatePrice();
  }

  toggleZoneExpand(zone: string): void {
    this.expandedZones[zone] = !this.expandedZones[zone];
  }

  removeZone(zone: string): void {
    const index = this.selectedZones.indexOf(zone);
    if (index !== -1) {
      this.selectedZones.splice(index, 1);
      // Remove associated regions
      this.selectedRegions = this.selectedRegions.filter(
        region => !this.zones[zone].includes(region)
      );
      this.calculatePrice();
    }
  }

  removeRegion(region: string): void {
    const index = this.selectedRegions.indexOf(region);
    if (index !== -1) {
      this.selectedRegions.splice(index, 1);
      this.calculatePrice();
    }
  }


// Select a tag from the dropdown
selectTag(tag: string): void {
  this.addUniqueTag(tag);
  this.tagInput.setValue(''); // Clear the input
}

// Helper method to add a tag only if it's unique
private addUniqueTag(tag: string): void {
  if (!this.selectedTags.includes(tag)) {
    this.selectedTags.push(tag);
    this.taskForm.patchValue({ tags: this.selectedTags });
  }
}
  addTag(event: any): void {
    const input = event?.target as HTMLInputElement || null;
    const value = input.value.trim();

    // Add tag when comma or enter is pressed
    if ((event?.key === ',' || event?.key === 'Enter') && value) {
      const tag = value.replace(',', '');
      if (!this.selectedTags.includes(tag) && this.filteredTags.includes(tag)) {
        this.selectedTags.push(tag);
        this.taskForm.patchValue({ tags: this.selectedTags });
      }
      input.value = '';
      event.preventDefault();
    }
  }

  removeTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
      this.taskForm.patchValue({ tags: this.selectedTags });
    }
  }
  
  handleZonesRegionsChange(zones: string[], regions: string[]): void {
    this.selectedZones = zones;
    this.selectedRegions = regions;
    this.taskForm.patchValue({
        zones: zones,
        regions: regions
      }, { emitEvent: true });
}

onSubmit() {
  if (this.taskForm.valid) {
    const taskData = this.taskForm.value;
    taskData.target = {
      sex: taskData.sex,
      ageRange: [taskData.ageRange.min, taskData.ageRange.max],
      zones: this.selectedZones,
      subRegions: this.selectedRegions
    };

    taskData.price = this.amount;
    taskData.numberOfEligibleUsers = this.nbrUser;

    this.taskService.save(taskData).subscribe(
      response => {
        this.router.navigate(['/confirme-task', response._id]);
      },
      error => {
        console.error('Error creating task', error);
      }
    );
  } else {
    // Log the form's invalid status
    console.log("Form is invalid");
    
    // Iterate over each form control and log their errors if any
    Object.keys(this.taskForm.controls).forEach(field => {
      const control = this.taskForm.get(field);
      if (control && control.invalid) {
        const errors = control.errors;
        console.log(`Invalid field: ${field}, Errors: `, errors);
      }
    });
  }
}


  
  update() {
    const taskData = this.taskForm.value;
    taskData.target = {
      sex: taskData.sex,
      ageRange: [taskData.ageRange.min, taskData.ageRange.max],
      zone: taskData.zone,
      subRegion: taskData.subRegion
    };

    taskData.price = this.amount;
    taskData.numberOfEligibleUsers = this.nbrUser;
    console.log("taskData", taskData)
    this.taskService.update(this.idUpdate,taskData).subscribe(response => {
      console.log('Task created', response);
      console.log('Task _id created', response._id);
      this.router.navigate(['/confirme-task', response._id]);
      // Handle success
    }, error => {
      console.error('Error creating task', error);
      // Handle error
    });
  }


  redirectToEditQuiz(taskId) {
    this.router.navigate(['/confirme-task', taskId]);
  }

  getDaysBetweenDates(startDate: string | null, endDate: string | null): number {
    // If either date is null, return 1 day
    if (!startDate || !endDate) {
      return 1;
    }
  
    // Parse the dates
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Calculate the time difference in milliseconds
    const timeDifference = end.getTime() - start.getTime();
  
    // Convert the time difference to days
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)); // 1000 ms * 3600 seconds * 24 hours
  
    // If the difference is less than 1 day, return 1
    return daysDifference < 1 ? 1 : daysDifference;
  }

  calculatePrice() {
    const target = {
      sex: this.taskForm.get('sex')?.value,
      ageRange: [this.taskForm.get('ageRange.min')?.value, this.taskForm.get('ageRange.max')?.value],
      zone: this.taskForm.get('zone')?.value
    };

    this.taskService.calculatePrice(target).subscribe(response => {
      this.eligibleUsers = response.numberOfEligibleUsers;
      this.nbrUser = this.eligibleUsers;
      this.totalPrice = response.totalPrice*this.getDaysBetweenDates(this.taskForm.get('startDate')?.value,this.taskForm.get('endDate')?.value);
      this.amount = this.totalPrice;

    }, error => {
      console.error('Error calculating price', error);
    });
  }

  changeUserChnageBudget(changeUser: boolean, chnageBudget: boolean) {
    const ratio = this.totalPrice/this.eligibleUsers;
    if(changeUser) {
      this.amount = this.nbrUser*ratio | 0;
    }
    if (chnageBudget) {
      this.nbrUser = this.amount/ratio | 0;
    }
  }






  fetchTask(): void {
    this.TaskService.getAll().subscribe(tasks => {
      console.log('Fetched tasks:', tasks);
      this.tasks = tasks;
    });
  }

  selectPhoto(e: any) {
    this.photo = e.target.files[0];
  }

  replaceText(e: string) {
    return "http://localhost:3000/" + e?.replace('uploads', '');
  }

  delete(id: any) {
    this.TaskService.delete(id).subscribe(() => {
      this.fetchTask()
    });
  }

  edit(id: any) {
    this.toEdit = true;
    let tempTask = this.tasks.filter((t: any) => t._id == id)[0];
    this.task.taskName = tempTask.taskName;
    this.task.zone = tempTask.zone;
    this.task.description = tempTask.description;
    this.task.numberOfEligibleUsers = tempTask.numberOfEligibleUsers;
    this.task.price = tempTask.price;
    this.selectedZones = Array.isArray(tempTask.target.zones) 
    ? tempTask.target.zones 
    : tempTask.target.zone ? [tempTask.target.zone] : [];
    
  this.selectedRegions = Array.isArray(tempTask.target.subRegions)
    ? tempTask.target.subRegions
    : tempTask.target.subRegions ? [tempTask.target.subRegions] : [];
    
    this.task = { ...tempTask, target: { ...tempTask.target } };
    this.task.startDate = new Date(tempTask.startDate);
    this.task.endDate = new Date(tempTask.endDate);
    this.updateStep = true;
    this.idUpdate = id;

    // Patch the form with tempTask values
    this.taskForm.patchValue({
      taskName: tempTask.taskName,
      taskType: tempTask.taskType,
      description: tempTask.description,
      sex: tempTask.target.sex || '',  // Assuming target has a sex field
      ageRange: {
        min: tempTask.target.ageRange[0] || '',  // Assuming target has ageRange
        max: tempTask.target.ageRange[1] || ''
      },
      zones: this.selectedZones,
      subRegion: this.selectedRegions,
      startDate: new Date(tempTask.startDate).toISOString().slice(0, 10),
      endDate: new Date(tempTask.endDate).toISOString().slice(0, 10),
    });
    console.log("this.task.startDate " ,  this.task.startDate );
    this.eligibleUsers = tempTask.numberOfEligibleUsers;
    this.nbrUser = this.eligibleUsers;
    this.totalPrice = tempTask.price;
    this.amount = tempTask.price;
    this.openModal();
  }

  calculateTaskDuration(startDate: Date, endDate: Date): number {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diff = end - start;
    return diff / (1000 * 60 * 60 * 24); // Convert milliseconds to days
  }


  // Open the modal
  openModal() {
    this.isModalOpen = true;
  }

  // Close the modal
  closeModal() {
    this.isModalOpen = false;
  }


}
