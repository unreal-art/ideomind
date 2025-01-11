<script lang="ts">
 import {
  Button,
  buttonVariants
 } from "$lib/components/ui/button/index.js";
 import * as Dialog from "$lib/components/ui/dialog/index.js";
 import { Input } from "$lib/components/ui/input/index.js";
 import { Label } from "$lib/components/ui/label/index.js";
 import { toast } from 'svelte-sonner';
 import { Zap } from 'lucide-svelte';
let open = $state(false)
 	
	const showNotice = () => {
		toast('✨ Full Access Unlocked!', {
			description:
				"Enjoy complimentary access to all features during our test phase! 🚀 Don't miss out on this exclusive opportunity."
		});
	};

</script>
 
<Dialog.Root bind:open={open}>
 <Dialog.Trigger 
  >
  <Button
			
			class="flex h-10 space-x-2 bg-red-200 text-red-600 hover:bg-red-700 hover:text-white"
			><Zap size={20} /> <span>Upgrade</span>
		</Button>
  </Dialog.Trigger
 >
 <Dialog.Content class="sm:max-w-[425px]">
  <Dialog.Header>
   <Dialog.Title>
    Upgrade
   </Dialog.Title>
   <Dialog.Description>
    Add to your current credit count.
   </Dialog.Description>
  </Dialog.Header>

   <div class=" items-center gap-4">
    <Label for="name" class="text-right">Amount</Label>
    <Input id="name" type="number" min={0.0000001} placeholder="0.0"  />
   </div>
  

  <Dialog.Footer>
   <Button type="submit">Upgrade</Button>
  </Dialog.Footer>
 </Dialog.Content>
</Dialog.Root>