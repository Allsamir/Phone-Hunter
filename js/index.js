tailwind.config = {
      theme: {
        extend: {
          colors: {
            clifford: '#da373d',
            bgModal: 'rgba(13, 110, 253, 0.05)',
            btnBg: '#0D6EFD'
          }
        }
      }
    }
    const phoneContainer = document.getElementById('phone-container');
    const errorMeassageContainer = document.getElementById('error-meassage-container');
    const searchField = document.getElementById('search-field');
    const showAllPhones = document.getElementById('show-all');
    const loadingSpinner = document.getElementById('spinner');
    const showDetails = document.getElementById('show-details');

    const toggleSpinner = (isLoading) => {
      isLoading ? loadingSpinner.classList.remove('hidden') : loadingSpinner.classList.add('hidden');
    }

    const loadData = (phone = '13', showAll) => {
          const searchedPhone = `https://openapi.programming-hero.com/api/phones?search=${phone}`;
          fetch(searchedPhone)
          .then(res => res.json())// converts into realdata or object
          .then(data => {
                    const status = data.status;
                    const phones = data.data;
                    status ? displayPhones(phones, showAll) : displayNothingFound();
          })
          .catch(error => console.error("Error:", error));
    }

    const loadPhoneDetailsData = (dataUrl) => {
      const detailDataURL = `https://openapi.programming-hero.com/api/phone/${dataUrl}`;
      fetch(detailDataURL)
      .then(res => res.json()) // converts json data to real data
      .then(data => {
        showPhoneDetails(data);
      })
      .catch(error => console.error(error));
    }

    const displayPhones = (phones, showAll) => {
          phoneContainer.innerHTML = '';
          if (phones.length > 9) {
            showAllPhones.classList.remove('hidden');
          }
                if(!showAll) {
                  phones = phones.slice(0, 9)
                } else { 
                  phones = phones;
                  showAllPhones.classList.add('hidden');
                  searchField.value = '';
                }
                phones.map(phone => {
                    const {brand, phone_name, slug: id, image} = phone;
                    const div = document.createElement('div');
                    div.classList.add('card', 'w-96', 'shadow-xl');
                    div.innerHTML = `
                    <figure><img src="${image}" alt="Phone"/></figure>
                    <div class="card-body">
                    <h2 class="card-title text-black">${brand}</h2>
                    <p class="text-black">${phone_name}</p>
                    <div class="card-actions justify-end">
                    <button class="btn bg-btnBg text-white border-none" onclick="loadPhoneDetailsData('${id}')">Show details</button>
                    </div>
                    </div>
                    `;
                    phoneContainer.appendChild(div);
          })

          toggleSpinner(false);
    }

    const displayNothingFound = () => {
      errorMeassageContainer.showModal();
      toggleSpinner(false);
    }

    const handleSearch = (showAll) => {
      const searchValue = searchField.value.toLowerCase()
      loadData(searchValue, showAll);
      toggleSpinner(true);
    }

    const showAllData = () => {
      handleSearch(true)
    }
    
    const showPhoneDetails = (detailsData) => {
      const mainData = detailsData.data;
      const mainFeatures = mainData?.mainFeatures;
      const otherData = mainData?.others;

      const gps = mainData?.others?.GPS || "No GPS";
      const storage = mainData?.mainFeatures?.storage;
      const displaySize = mainData?.mainFeatures?.displaySize;
      const chipSet = mainData?.mainFeatures?.chipSet;
      const memory = mainData?.mainFeatures?.memory;
      const {slug, name, releaseDate, brand, image} = mainData;
      showDetails.innerHTML = `
      <div class="modal-box w-11/12 max-w-5xl bg-white text-black">
        <div class="text-modal text-center bg-bgModal py-14">
          <img src="${image}" class="mx-auto"/>
        </div>
        <div class="mt-12">
        <h1 class="text-3xl text-black font-bold">${name}</h1>
        <p class="text-base text-black py-6">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
        <div class="pb-4"><span class="text-black text-xl font-bold">Storage: </span><span class="text-black text-xl">${storage}</span></div>
        <div class="pb-4"><span class="text-black text-xl font-bold">Display Size: </span><span class="text-black text-xl">${displaySize}</span></div>
        <div class="pb-4"><span class="text-black text-xl font-bold">Chipset: </span><span class="text-black text-xl">${chipSet}</span></div>
        <div class="pb-4"><span class="text-black text-xl font-bold">Memoray: </span><span class="text-black text-xl">${memory}</span></div>
        <div class="pb-4"><span class="text-black text-xl font-bold">Slug: </span><span class="text-black text-xl">${slug}</span></div>
        <div class="pb-4"><span class="text-black text-xl font-bold">Release Date: </span><span class="text-black text-xl">${releaseDate}</span></div>
        <div class="pb-4"><span class="text-black text-xl font-bold">Brand: </span><span class="text-black text-xl">${brand}</span></div>
        <div class="pb-4"><span class="text-black text-xl font-bold">GPS: </span><span class="text-black text-xl">${gps}</span></div>
        </div>
        <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button, it will close the modal -->
        <button class="btn btn-outline btn-lg btn-error text-white">Close</button>
      </form>
      </div>
    </div>
      `
      showDetails.showModal();
    }

loadData();