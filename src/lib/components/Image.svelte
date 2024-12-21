<script lang="ts">
  import { getImageUrl } from '@/api';

  let DEFAULT_IMAGE = "/assets/loading.png"; // Default fallback image
  let { item } = $props(); // Get `item` from props
  let imageUrl = $state(""); // State for the image URL
  let isLoading = $state(true); // Track whether the image is loading

  // Function to fetch the image
  const getImage = async (cid: string) => {
    try {
      imageUrl = (await getImageUrl(cid)) as string;
    } catch (error) {
      console.error('Error fetching image:', error);
      imageUrl = DEFAULT_IMAGE; // Use fallback image on fetch error
    } finally {
      isLoading = false; // Hide loading spinner once image is resolved
    }
  };

  // Fetch the image when the component initializes
  $effect(() => {
    getImage(item.ipfsImages[0].cid);
  });

  // Function to handle image load errors
  function handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
target.src = DEFAULT_IMAGE
    isLoading = false; // Stop loading indicator
  }
</script>

<a href={`/details/${item.id}`}>

    <!-- Image -->
    <img 
      src={imageUrl} 
      alt="user profile" 
      class={`w-full rounded-sm transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`} 
      onerror={handleImageError}
      onload={() => (isLoading = false)} 
    />
 

</a>