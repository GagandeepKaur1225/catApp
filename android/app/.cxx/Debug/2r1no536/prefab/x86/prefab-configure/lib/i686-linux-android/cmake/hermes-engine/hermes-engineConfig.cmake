if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/hidayatrehmat/.gradle/caches/transforms-3/d6476d0bced3f2998774aefa27dc598e/transformed/jetified-hermes-android-0.71.3-debug/prefab/modules/libhermes/libs/android.x86/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/hidayatrehmat/.gradle/caches/transforms-3/d6476d0bced3f2998774aefa27dc598e/transformed/jetified-hermes-android-0.71.3-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

