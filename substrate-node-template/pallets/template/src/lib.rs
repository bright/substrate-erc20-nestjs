#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
    decl_module, decl_storage, decl_event, decl_error, ensure, StorageMap
};
use frame_system::{self as system, ensure_signed};

pub trait Trait: system::Trait {
    /// The overarching event type.
    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

// This pallet's events.
decl_event! {
    pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
        /// Token was initialized by user
		Initialized(AccountId),
        /// Tokens successfully transferred between users
        Transfer(AccountId, AccountId, u64), // (from, to, value)
    }
}

// This pallet's errors.
decl_error! {
    pub enum Error for Module<T: Trait> {
        /// Attempted to initialize the token after it had already been initialized.
        AlreadyInitialized,
        /// Attempted to transfer more funds than were available
        InsufficientFunds,
    }
}

// This pallet's storage items.
decl_storage! {
    trait Store for Module<T: Trait> as TemplateModule {
        pub Balances get(fn get_balance): map hasher(blake2_128_concat) T::AccountId => u64;
		pub TotalSupply get(fn total_supply): u64 = 0;
		Init get(fn is_init): bool;
    }
}

// The pallet's dispatchable functions.
decl_module! {
    /// The module declaration.
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        // Initializing errors
        // this includes information about your errors in the node's metadata.
        // it is needed only if you are using errors in your pallet
        type Error = Error<T>;

        // A default function for depositing events
        fn deposit_event() = default;

		#[weight = 10_000]
        pub fn init(origin, total_supply: u64) {
			let sender = ensure_signed(origin)?;
			ensure!(!Self::is_init(), <Error<T>>::AlreadyInitialized);

			TotalSupply::put(total_supply);
			<Balances<T>>::insert(sender, total_supply);

			Init::put(true);
		}

		#[weight = 10_000]
        pub fn transfer(_origin, to: T::AccountId, value: u64) {
			let sender = ensure_signed(_origin)?;
			
			// TODO - create a private function
			// ***** Start
			// fn transfer_from_to(from: T::AccountId, to: T::AccountId, value: u64) -> Result {
			let from_balance = Self::get_balance(&sender);
			let to_balance = Self::get_balance(&to);

			// Calculate new balances
			let updated_from_balance = from_balance.checked_sub(value).ok_or("overflow")?;
			let updated_to_balance = to_balance.checked_add(value).expect("Entire supply fits in u64; qed");

			// Write new balances to storage
			<Balances<T>>::insert(&sender, updated_from_balance);
			<Balances<T>>::insert(&to, updated_to_balance);

			Self::deposit_event(RawEvent::Transfer(sender, to, value));
			//}
			// ***** End
		}
    }
}

// impl<T: Trait> Module<T> {
    // the ERC20 standard transfer function
    // internal
    // fn _transfer(
    //     token_id: u32,
    //     from: T::AccountId,
    //     to: T::AccountId,
    //     value: T::TokenBalance,
    // ) -> Result {
    //     ensure!(<BalanceOf<T>>::exists((token_id, from.clone())), "Account does not own this token");
    //     let sender_balance = Self::balance_of((token_id, from.clone()));
    //     ensure!(sender_balance >= value, "Not enough balance.");

    //     let updated_from_balance = sender_balance.checked_sub(&value).ok_or("overflow in calculating balance")?;
    //     let receiver_balance = Self::balance_of((token_id, to.clone()));
    //     let updated_to_balance = receiver_balance.checked_add(&value).ok_or("overflow in calculating balance")?;
        
    //     // reduce sender's balance
    //     <BalanceOf<T>>::insert((token_id, from.clone()), updated_from_balance);

    //     // increase receiver's balance
    //     <BalanceOf<T>>::insert((token_id, to.clone()), updated_to_balance);

    //     Self::deposit_event(RawEvent::Transfer(token_id, from, to, value));
    //     Ok(())
    // }
// fn transfer_from_to(from: T::AccountId, to: T::AccountId, value: u64) -> Result<(), T> {
// 			let from_balance = Self::get_balance(&from);
// 			let to_balance = Self::get_balance(&to);

// 			// Calculate new balances
// 			let updated_from_balance = from_balance.checked_sub(value).ok_or("overflow")?;
// 			let updated_to_balance = to_balance.checked_add(value).expect("Entire supply fits in u64; qed");

// 			// Write new balances to storage
// 			<Balances<T>>::insert(&from, updated_from_balance);
// 			<Balances<T>>::insert(&to, updated_to_balance);

// 			Self::deposit_event(RawEvent::Transfer(from, to, value));
// 			Ok(())
// 		}

		
// }